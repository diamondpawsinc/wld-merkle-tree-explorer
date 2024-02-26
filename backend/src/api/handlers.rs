use crate::tree_builder;
use anyhow::Result;
use ruint::{aliases::U256, Uint};
use semaphore::{
    merkle_tree::{Branch, Hasher},
    poseidon_tree::PoseidonHash,
};
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use warp::{self, http::StatusCode};

#[derive(Serialize, Deserialize, Debug)]
struct TreePathResult {
    name: String,
    children: Vec<TreePathResult>,
}

#[derive(Serialize)]
pub struct NotFoundResponse {
    pub status: String,
}

pub async fn get_tree_path(worldid: U256) -> Result<Box<dyn warp::Reply>, Infallible> {
    let latest_leaf_index: usize = match tree_builder::track::get_latest_leaf_index().await {
        Ok(res) => res as usize,
        Err(_) => return Ok(Box::new(StatusCode::BAD_REQUEST)),
    };
    let search_value: Uint<256, 4> = Uint::<256, 4>::from(worldid);

    let tree = tree_builder::state::get_tree();
    for (leaf_index, tree_leaf) in tree.leaves().enumerate() {
        if tree_leaf == search_value {
            let tree_proof = tree.proof(leaf_index);
            let path_indexes = tree_proof.path_index();
            let mut current_hash = search_value;
            let mut tree_path_result = TreePathResult {
                name: format!("{:#x}", search_value),
                children: vec![],
            };
            for (node_hash, path_value) in tree_proof.0.iter().zip(path_indexes.iter()) {
                let node_hash_value = match node_hash {
                    Branch::Left(val) => val,
                    Branch::Right(val) => val,
                };
                if *path_value == Uint::<256, 4>::from(0) {
                    // left node
                    current_hash = PoseidonHash::hash_node(&current_hash, &node_hash_value);
                    tree_path_result = TreePathResult {
                        name: format!("{:#x}", current_hash),
                        children: vec![
                            tree_path_result,
                            TreePathResult {
                                name: format!("{:#x}", node_hash_value),
                                children: vec![],
                            },
                        ],
                    };
                } else if *path_value == Uint::<256, 4>::from(1) {
                    // right node
                    current_hash = PoseidonHash::hash_node(&node_hash_value, &current_hash);
                    tree_path_result = TreePathResult {
                        name: format!("{:#x}", current_hash),
                        children: vec![
                            TreePathResult {
                                name: format!("{:#x}", node_hash_value),
                                children: vec![],
                            },
                            tree_path_result,
                        ],
                    };
                }
            }
            return Ok(Box::new(warp::reply::with_status(
                warp::reply::json(&tree_path_result),
                warp::http::StatusCode::OK,
            )));
        }
        if leaf_index > latest_leaf_index {
            return Ok(Box::new(StatusCode::NOT_FOUND));
        }
    }

    Ok(Box::new(StatusCode::NOT_FOUND))
}

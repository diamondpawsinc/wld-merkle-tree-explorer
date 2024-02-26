use crate::tree_builder;
use ruint::Uint;
use semaphore::{
    lazy_merkle_tree::{Canonical, LazyMerkleTree},
    poseidon_tree::{LazyPoseidonTree, PoseidonHash},
    Field,
};
use std::path::Path;

const TREE_DEPTH: usize = 30;
const TREE_MMAP_FILEPATH: &str = "./tree_mmap";

pub async fn setup_tree() {
    tree_builder::track::setup().await;

    if !Path::new(TREE_MMAP_FILEPATH).exists() {
        println!(
            "Tree mmap at file path {} not found, setting up tree mmap...",
            TREE_MMAP_FILEPATH
        );

        let tree_leaf_zero_value: Uint<256, 4> = Field::from(0);
        let _ = LazyPoseidonTree::new_mmapped_with_dense_prefix_with_init_values(
            TREE_DEPTH,
            TREE_DEPTH,
            &tree_leaf_zero_value,
            &Vec::new(),
            TREE_MMAP_FILEPATH,
        );

        println!("Done setting up tree mmap");
    }
}

pub fn get_tree() -> LazyMerkleTree<PoseidonHash, Canonical> {
    let tree_leaf_zero_value: Uint<256, 4> = Field::from(0);
    return LazyPoseidonTree::attempt_dense_mmap_restore(
        TREE_DEPTH,
        TREE_DEPTH,
        &tree_leaf_zero_value,
        TREE_MMAP_FILEPATH,
    )
    .unwrap();
}

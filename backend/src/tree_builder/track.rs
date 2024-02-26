use anyhow::Result;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;

const TREE_STATE_LATEST_BLOCK_NUMBER_FILEPATH: &str = "./tree_state_latest_block_number";
const TREE_STATE_LATEST_LEAF_INDEX: &str = "./tree_state_latest_leaf_index";

pub async fn setup() {
    if !Path::new(TREE_STATE_LATEST_BLOCK_NUMBER_FILEPATH).exists() {
        println!(
            "Tree state for latest block number at file path {} not found, setting up...",
            TREE_STATE_LATEST_BLOCK_NUMBER_FILEPATH
        );
        let mut file: File =
            File::create(TREE_STATE_LATEST_BLOCK_NUMBER_FILEPATH).expect("Failed to open file");
        // 17637406 because of first known register identities call
        let _ = writeln!(file, "{}", 17637405);
    }
    if !Path::new(TREE_STATE_LATEST_LEAF_INDEX).exists() {
        println!(
            "Tree state for latest leaf index at file path {} not found, setting up...",
            TREE_STATE_LATEST_LEAF_INDEX
        );
        let mut file: File =
            File::create(TREE_STATE_LATEST_LEAF_INDEX).expect("Failed to open file");
        let _ = writeln!(file, "{}", 0);
    }
}

pub async fn get_latest_block_number() -> Result<u32> {
    let mut file =
        File::open(TREE_STATE_LATEST_BLOCK_NUMBER_FILEPATH).expect("Failed to open file");
    let mut contents = String::new();
    let _ = file.read_to_string(&mut contents);
    let latest_indexed_block_number: u32 = contents
        .trim()
        .parse()
        .expect("Tree state latest block number is not valid");
    Ok(latest_indexed_block_number)
}

pub async fn get_latest_leaf_index() -> Result<u32> {
    let mut file = File::open(TREE_STATE_LATEST_LEAF_INDEX).expect("Failed to open file");
    let mut contents = String::new();
    let _ = file.read_to_string(&mut contents);
    let latest_leaf_index: u32 = contents
        .trim()
        .parse()
        .expect("Tree state latest leaf index is not valid");
    Ok(latest_leaf_index)
}

pub async fn update_latest_block_number(block_number: u32) {
    let mut file =
        File::create(TREE_STATE_LATEST_BLOCK_NUMBER_FILEPATH).expect("Failed to open file");
    let _ = writeln!(file, "{}", block_number);
}

pub async fn update_latest_leaf_index(leaf_index: u32) {
    let mut file = File::create(TREE_STATE_LATEST_LEAF_INDEX).expect("Failed to open file");
    let _ = writeln!(file, "{}", leaf_index);
}

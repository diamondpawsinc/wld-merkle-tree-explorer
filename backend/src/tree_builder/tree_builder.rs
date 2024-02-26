use crate::data;
use crate::tree_builder;
use anyhow::Result;
use ruint::Uint;
use std::time::Duration;

pub async fn update_tree() -> Result<()> {
    let latest_block_number = tree_builder::track::get_latest_block_number().await?;
    println!(
        "Updating Tree with latest Block Number: {}",
        latest_block_number
    );

    let start_block_number = latest_block_number;
    let end_block_number = start_block_number + 5000;
    let worldcoin_transactions =
        data::data::get_worldcoin_transactions_data(start_block_number, end_block_number).await?;

    println!(
        "Found {} relevant worldcoin transactions, processing...",
        worldcoin_transactions.len()
    );

    let mut tree = tree_builder::state::get_tree();

    for worldcoin_transaction in worldcoin_transactions {
        // sanity check pre_root is expected value
        let current_tree_root = tree.root();
        let mut transaction_root_bytes: [u8; 32] = [0u8; 32];
        worldcoin_transaction
            .pre_root
            .to_big_endian(&mut transaction_root_bytes);
        let transaction_root: Uint<256, 4> = Uint::<256, 4>::from_be_bytes(transaction_root_bytes);
        if current_tree_root != transaction_root {
            return Err(anyhow::anyhow!(
                "OnChain Tree Pre Root and Mmap Tree Pre Root do not match"
            ));
        }

        let mut leaf_index = worldcoin_transaction.start_index;
        for identity_commitment in worldcoin_transaction.identity_commitments {
            let mut bytes: [u8; 32] = [0u8; 32];
            identity_commitment.to_big_endian(&mut bytes);
            let identity_commitment_ruint = Uint::<256, 4>::from_be_bytes(bytes);
            tree = tree.update_with_mutation(leaf_index as usize, &identity_commitment_ruint);
            leaf_index = leaf_index + 1;
        }

        tree_builder::track::update_latest_block_number(worldcoin_transaction.block_number).await;
        tree_builder::track::update_latest_leaf_index(worldcoin_transaction.block_number).await;
    }
    Ok(())
}

const POLLING_INTERVAL_SECONDS: u64 = 30;
pub async fn start_cronjob() {
    println!(
        "Starting Tree Builder Cronjob with polling interval of {}s",
        POLLING_INTERVAL_SECONDS
    );

    tree_builder::state::setup_tree().await;

    let _ = tokio::spawn(async {
        loop {
            match update_tree().await {
                Ok(_) => {}
                Err(e) => println!("{}", e),
            }

            tokio::time::sleep(Duration::from_secs(POLLING_INTERVAL_SECONDS)).await;
        }
    });
}

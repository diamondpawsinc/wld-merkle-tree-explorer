use anyhow::{Context, Result};
use ethers::contract::abigen;
use ethers::core::abi::AbiDecode;
use ethers::types::{Bytes, U256};
use serde::{Deserialize, Deserializer};

abigen!(
    IWorldcoinIdentityOperator,
    r#"[
      registerIdentities(uint256[8] insertionProof, uint256 preRoot, uint32 startIndex, uint256[] identityCommitments, uint256 postRoot)
  ]"#,
);

const ETHERSCAN_QUERY_URL: &str = "https://api.etherscan.io/api?module=account&action=txlist&address=0xf7134CE138832c1456F2a91D64621eE90c2bddEa&offset=100&sort=asc";
const ETHERSCAN_API_KEY: &str = "";
const WORLDCOIN_CONTRACT_REGISTER_IDENTITIES_SELECTOR: &str = "0x2217b211";

fn from_str_to_u32<'de, D>(deserializer: D) -> Result<u32, D::Error>
where
    D: Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    s.parse::<u32>().map_err(serde::de::Error::custom)
}

fn from_str_to_bool<'de, D>(deserializer: D) -> Result<bool, D::Error>
where
    D: Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    match s.as_str() {
        "1" => Ok(true),
        "0" => Ok(false),
        other => Err(serde::de::Error::custom(format!(
            "invalid boolean value: {}",
            other
        ))),
    }
}

#[derive(Debug, Deserialize)]
pub struct EtherscanTransaction {
    #[serde(rename = "blockNumber", deserialize_with = "from_str_to_u32")]
    block_number: u32,
    #[serde(rename = "isError", deserialize_with = "from_str_to_bool")]
    is_error: bool,
    input: String,
}

pub struct WorldcoinTransactionData {
    pub block_number: u32,
    pub identity_commitments: Vec<U256>,
    pub start_index: u32,
    pub pre_root: U256,
}

pub async fn get_worldcoin_transactions_data(
    start_block_number: u32,
    end_block_number: u32,
) -> Result<Vec<WorldcoinTransactionData>> {
    let mut results: Vec<WorldcoinTransactionData> = Vec::new();

    let mut etherscan_page: u8 = 1;
    loop {
        let mut query_url = format!(
            "{}&startblock={}&endblock={}&page={}",
            ETHERSCAN_QUERY_URL, start_block_number, end_block_number, etherscan_page,
        );
        if ETHERSCAN_API_KEY != "" {
            query_url = format!("{}&apikey={}", query_url, ETHERSCAN_API_KEY);
        }

        let response = reqwest::get(query_url).await?;
        let response_json: serde_json::Value = response.json().await?;
        let result_value = response_json
            .get("result")
            .ok_or_else(|| anyhow::anyhow!("Missing 'result' key in API response"))?;

        let transactions: Vec<EtherscanTransaction> = serde_json::from_value(result_value.clone())
            .context("Failed to deserialize 'result' into WorldcoinTransactionData")?;

        if transactions.is_empty() {
            // no more transactions, return all
            return Ok(results);
        }

        for transaction in transactions {
            if transaction.is_error == true {
                continue;
            }
            if !transaction
                .input
                .starts_with(WORLDCOIN_CONTRACT_REGISTER_IDENTITIES_SELECTOR)
            {
                continue;
            }

            let calldata: Bytes = transaction.input.parse().unwrap();
            let decoded_calldata = RegisterIdentitiesCall::decode(&calldata)
                .expect("cannot decode transaction calldata");

            results.push(WorldcoinTransactionData {
                block_number: transaction.block_number,
                identity_commitments: decoded_calldata.identity_commitments,
                start_index: decoded_calldata.start_index,
                pre_root: decoded_calldata.pre_root,
            })
        }

        etherscan_page += 1;
    }
}

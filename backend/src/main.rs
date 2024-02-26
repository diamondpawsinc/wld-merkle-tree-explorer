mod api;
mod data;
mod tree_builder;

#[tokio::main]
async fn main() {
    tree_builder::tree_builder::start_cronjob().await;
    api::api::start().await;
}

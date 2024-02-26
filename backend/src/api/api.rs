use crate::api::routes;

const PORT_NUMBER: u16 = 3000;
pub async fn start() {
    println!("Starting API Server on Port {}", PORT_NUMBER);

    let api_routes = routes::get_tree_path();

    warp::serve(api_routes)
        .run(([127, 0, 0, 1], PORT_NUMBER))
        .await;
}

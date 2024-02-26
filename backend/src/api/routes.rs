use crate::api::handlers;
use ruint::aliases::U256;

use warp::{self, Filter};

pub fn get_tree_path() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("get_tree_path" / U256)
        .and(warp::get())
        .and_then(handlers::get_tree_path)
        .with(warp::cors().allow_any_origin())
}

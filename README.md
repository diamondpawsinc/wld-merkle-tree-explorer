<h1 align="center">
  <br>
  <a href="https://github.com/diamondpawsinc/wld-merkle-tree-explorer"><img src="https://raw.githubusercontent.com/diamondpawsinc/wld-merkle-tree-explorer/main/frontend/img/logo-small-reverse-invert.svg?token=GHSAT0AAAAAACNQ5YZHQSQYPX3LYJDOUCRMZTRZBQA" width="100"></a>
  <br>
    Worldcoin Merkle Tree Explorer
  <br>
</h1>

This repository contains the Merkle Tree Explorer, which provides an explorer that will visualize the Merkle Tree from the Merkle root that is committed to the Ethereum blockchain. This allows users to verify the validity of World ID in an accessible way, advancing decentralization through transparency, verifiability, and resilience.

## 🎯 Goals

### Transparency

The Merkle tree explorer will provide transparency by visualizing the Merkle root's construction through the Merkle tree. Users can see their World ID through the tree and how it is included on the chain. Developers can view the explorer as a reference to reconstruct a Merkle tree to compute a Merkle inclusion proof for their applications. 

### Verifiability

Even though the leaves of the Merkle tree are publicly available, it is not practical for clients to download all of the data necessary to reconstruct the tree and compute a Merkle inclusion proof. 

The Merkle Tree Explorer can lower this barrier by revealing the leaves in a consumable format with a user interface. Because the data necessary to reconstruct the Merkle tree is available and easily consumable, users can verify the validity of World ID in an accessible way.

### Resilience

With a Merkle tree explorer, clients can verify the correctness of the Merkle proof against the on-chain root in a more permissionless and privacy-preserving manner. 

Today's client will verify a World ID by requesting proof of identity from a sequencer. This would require the client to trust the centralized sequencer. In addition, client requests could leak sensitive information that could breach client privacy.

With a Merkle tree explorer, clients can use it as a reference to construct the Merkle tree permissionlessly without needing to trust a sequencer. In addition, because no requests are made to a central sequencer, there will be no data leakage, preserving privacy.

## ⏳ Why now?

The Merkle tree explorer is the first step towards a more transparent, robust, and verifiable Worldcoin. With the launch of World ID 2.0 and the WLD token, it’s the right time to advance World ID to a global scale and provide the tools to users and developers. Visualizations, data, and developer tools are key drivers of this mission. 

Visualizations enable transparency to the protocol for both users and developers. Transparency increases developers' accessibility to build on the protocol and enables users to trust the protocol by verifying data and information on it.

Data tools allow users to verify that information is available and accessible to everyone. It also allows users to track and participate in the growth of the protocol. 

Developers can utilize visual tools to speed up development cycles and workflows. This is the fastest way to enable the development and advancement of a new protocol.

With the launch of World ID 2.0, users and developers need to be onboarded to grow and develop the protocol. Further developments of Worldcoin as a zk rollup will require visualization, data, and developer tools to support its growth. A Merkle tree explorer is the first product in a set of visualization and data tools that will further advance the development and decentralization of Worldcoin.

## 🛠️ Setup

### Frontend

1. Install dependencies

   - `cd frontend && npm install`

2. Build the app

   - `npm run build`

3. Deploy the app

   - `./frontend/build` directory

4. Development server

   - `npm run build-css` to watch for css changes
   - `npm start` to start the development server

###### Example with Netlify - Build settings

- Base directory `./frontend/`
- Package directory `frontend/node_modules`
- Build command `npm run build`
- Publish directory `./frontend/build`
- Functions directory `./frontend/netlify/functions`

### Backend

#### Overview

It consists of two components:

- `tree_builder`: used to sync and maintain the backend tree state with the on-chain state
  - uses etherscan API to sync, highly recommend setting the etherscan API key here `./backend/src/data/data.rs`
  - The initial tree takes a long time to sync; message us for a snapshot to speed things up
- `API`: REST API service to provide data for the tree path

#### Usage

- Must have rust installed

To build from source, run

```bash
cargo build --release
```

This will build a binary at `./target/release/backend,` which can be used to run the
tree builder and API service

## 🫂 Credits

- Jon ([@0xmonkeyy](https://github.com/0xmonkeyy))
- Sean ([@0xs34n](https://github.com/0xs34n))
- Worldcoin Foundation: DCBuilder ([@dcbuild3r](https://github.com/dcbuild3r)), Josh West ([@1pc_exp](https://x.com/1pc_exp)), George ([@gioser](https://x.com/0xgioser))

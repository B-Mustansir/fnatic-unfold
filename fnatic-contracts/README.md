# SmartSwap DEX Contracts

This repository contains a collection of smart contracts designed to power a decentralized exchange (DEX) that integrates dynamic fee management, AI-driven volatility oracle, and cross-chain interoperability using Chainlink's CCIP and Axelar. Below is an overview of each contract, along with instructions on how to set up and deploy the contracts using Thirdweb.

> **Warning:** This code is not audited. Use at your own risk.

## Contents
- [Overview of Contracts](#overview-of-contracts)
  - [Counter](#counter)
  - [Smartly.sol](#smartlysol)
  - [VolatilityOracle.sol](#volatilityoraclesol)
  - [Dex.sol](#dexsol)
  - [SmartReceiver](#smartreceiver)
- [Setup and Installation](#setup-and-installation)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Compile the Contracts](#compile-the-contracts)
  - [Deploy the Contracts](#deploy-the-contracts)
- [How to Run](#how-to-run)

## Overview of Contracts

### Counter
The `Counter` contract extends Uniswap V4’s `BaseHook` to track and count the number of times swaps and position modifications occur within a liquidity pool. It maintains separate counters for the `before` and `after` hooks of these actions.

### Smartly.sol
The `Smartly` contract integrates Uniswap's V4 dynamic fee system with Chainlink's CCIP for cross-chain communication. The dynamic fee is set by a `VolatilityOracle` contract and updated through Chainlink's CCIP, ensuring that fees adjust based on asset volatility across different chains.

### VolatilityOracle.sol
This contract calculates asset volatility using on-chain AI/ML inference. It leverages Chainlink’s CCIP and Axelar for sending volatility data across different blockchain networks. The `VolatilityOracle` feeds this data to the `Smartly` contract to dynamically adjust trading fees based on current volatility.

### Dex.sol
The `DEX` contract provides the core functionality of a decentralized exchange, allowing users to:
- Add and remove liquidity
- Swap ETH for tokens and vice versa
- Calculate token prices using liquidity reserves
A 1% fee is applied to token swaps, ensuring proper liquidity management and incentivizing participation.

### SmartReceiver
The `SmartReceiver` contract extends the capabilities of Uniswap V4's dynamic fee system. It uses Chainlink's CCIP (and similarly Axelar) for cross-chain data transfer, including fee adjustments, received via cross-chain messages. The `VolatilityOracle` manages the volatility data used for dynamic fee calculation.

## Setup and Installation

### Clone the Repository
To begin, clone the repository by running:

```bash
git clone https://github.com/B-Mustansir/smartswap-dex-contracts
cd smartswap-dex-contracts
```

### Install Dependencies
Install the necessary dependencies using npm:

```bash
npm install
```

### Compile the Contracts
Compile the smart contracts with the following command:
```bash
npx thirdweb compile
```

### Deploy the Contracts
Authenticate on Thirdweb and deploy the contracts to any EVM-compatible blockchain with the following command:
```bash
npx thirdweb deploy
```

Now authenticate on Thirdweb and deploy the contracts.
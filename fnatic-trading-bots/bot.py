import json
from datetime import datetime
from openai import AzureOpenAI
import json
from swarm import Agent
from cdp import *
import os
from cdp.errors import ApiError, UnsupportedAssetError
from main import get_coin_data
from dotenv import load_dotenv
import requests

load_dotenv()

def get_crypto_price(crypto_slug):
    try:
        url = f"https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug={crypto_slug}"
        headers = {
            'X-CMC_PRO_API_KEY': os.environ.get("COINMARKETCAP_API_KEY")
        }
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            data = response.json()
            crypto_id = list(data['data'].keys())[0]  # Get the first (and only) key in the 'data' dictionary
            price = data['data'][crypto_id]['quote']['USD']['price']
            return price
        else:
            print(f"Error: Failed to fetch data. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching price: {e}")
        return None

API_KEY_NAME = os.environ.get("CDP_API_KEY_NAME")
PRIVATE_KEY = os.environ.get("CDP_PRIVATE_KEY", "").replace('\\n', '\n')

from pydantic import BaseModel, Field
from typing import List, Any

class TradingAgent(BaseModel):
    name: str
    wallet: str
    transaction_history: List[Any] = Field(default_factory=list)  # Use default_factory to initialize as empty list

    def __init__(self, name: str, wallet: str, **kwargs):
        super().__init__(name=name, wallet=wallet, **kwargs)

    def analyze_market(self, market_data):
        prompt = (
            f"Analyze the following market data and provide trading advice:\n{market_data} "
            f"\nRespond with BUY, SELL, or HOLD and reasoning."
        )
        client = AzureOpenAI(
            api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            api_version="2024-02-01",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
        )
        response = client.chat.completions.create(
            model="editai-gpt-4o",
            messages=[
                {"role": "system", "content": "Be a smart professional experienced Trader"},
                {"role": "user", "content": prompt}
            ]
        )
        print(f"Trading advice: {response.choices[0].message.content}")
        return response.choices[0].message.content

    def execute_trade(self, action, amount, asset, market_data):
        if action == "BUY":
            print(f"Preparing to buy {amount} of {asset}.")
            self.transfer_asset(amount, asset, "buyer_wallet_address")
            self.log_transaction(action, amount, asset, market_data[asset]['price'])
        elif action == "SELL":
            print(f"Preparing to sell {amount} of {asset}.")
            self.transfer_asset(amount, asset, "seller_wallet_address")
            self.log_transaction(action, amount, asset, market_data[asset]['price'])
        else:
            print("Holding position. No action taken.")

    def transfer_asset(self, amount, asset_id, destination_address):
        try:
            is_mainnet = self.wallet.network_id == "base-mainnet"
            is_usdc = asset_id.lower() == "usdc"
            gasless = is_mainnet and is_usdc

            if asset_id.lower() in ["eth", "usdc"]:
                transfer = self.wallet.transfer(amount, asset_id, destination_address, gasless=gasless)
                transfer.wait()
                gasless_msg = " (gasless)" if gasless else ""
                return f"Transferred {amount} {asset_id}{gasless_msg} to {destination_address}"

            try:
                balance = self.wallet.balance(asset_id)
            except UnsupportedAssetError:
                return f"Error: The asset {asset_id} is not supported on this network."

            if balance < amount:
                return f"Insufficient balance. You have {balance} {asset_id}, but tried to transfer {amount}."

            transfer = self.wallet.transfer(amount, asset_id, destination_address)
            transfer.wait()
            return f"Transferred {amount} {asset_id} to {destination_address}"
        except Exception as e:
            return f"Error transferring asset: {str(e)}."

    def log_transaction(self, action, amount, asset, price, timestamp=None):
        if timestamp is None:
            timestamp = datetime.now().isoformat()

        transaction = {
            "action": action,
            "amount": amount,
            "asset": asset,
            "price": price,
            "timestamp": timestamp
        }

        self.transaction_history.append(transaction)

        with open("transactions.json", "w") as f:
            json.dump(self.transaction_history, f, indent=4)

    def calculate_profit(self, market_data):
        total_spent = 0.0
        total_received = 0.0
        for transaction in self.transaction_history:
            if transaction['action'] == "BUY":
                total_spent += transaction['amount'] * transaction['price']
            elif transaction['action'] == "SELL":
                total_received += transaction['amount'] * transaction['price']

        portfolio_value = 0.0
        for asset, data in market_data.items():
            if asset in ["MTC"]:
                portfolio_value += self.wallet.balance * data['price']

        profit_or_loss = total_received - total_spent
        return profit_or_loss, portfolio_value

    def show_portfolio(self, market_data):
        profit_or_loss, portfolio_value = self.calculate_profit(market_data)
        print(f"Current Portfolio Value: {portfolio_value:.2f}")
        print(f"Profit/Loss: {profit_or_loss:.2f}")
        print(f"Transaction History:")
        for transaction in self.transaction_history:
            print(transaction)

    def auto_trade(self, market_data):
        print("Analyzing market conditions for trading signals...")
        advice = self.analyze_market(market_data)
        print(f"Trading Advice: {advice}")

        if "BUY" in advice.upper():
            asset = "MTC"  # Replace with the appropriate asset based on your use case
            asset_price = market_data.get(asset, {}).get('price')
            if asset_price:
                amount_to_buy = self.wallet.balance(asset) / asset_price
                self.execute_trade("BUY", amount_to_buy, asset, market_data)
            else:
                print("Market data for MTC is missing or invalid.")
        elif "SELL" in advice.upper():
            self.execute_trade("SELL", 0.0001, "MTC", market_data)
        else:
            print("No action taken based on market analysis.")

        self.show_portfolio(market_data)


def fetch_market_data():
    user_data = {"tweet_analysis": [{"coin_name": "bitcoin", "coin_review": 1}, {"coin_name": "ethereum", "coin_review": 0}, {"coin_name": "dogecoin", "coin_review": -1}]}
    market_data = {}

    for analysis in user_data['tweet_analysis']:
        crypto_name = analysis['coin_name']
        price = get_crypto_price(crypto_name)
        if price:
            market_data[crypto_name.upper()] = {"price": price, "sentiment": analysis['coin_review']}
    return market_data

while True:
    Cdp.configure(API_KEY_NAME, PRIVATE_KEY)
    agent_wallet = Wallet.create()
    faucet = agent_wallet.faucet()
    print(f"Faucet transaction: {faucet}")
    print(f"Agent wallet address: {agent_wallet.default_address.address_id}")

    # trading_agent = TradingAgent(name="Agent1", wallet=agent_wallet)
    trading_agent = TradingAgent(name="Agent1", wallet=str(agent_wallet))
    market_data = fetch_market_data()
    trading_agent.auto_trade(market_data)
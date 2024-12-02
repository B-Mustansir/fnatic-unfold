import json
from datetime import datetime
from openai import AzureOpenAI
import os
from swarm import Agent
from cdp import *
from cdp.errors import UnsupportedAssetError
from dotenv import load_dotenv
import requests
from pydantic import BaseModel, Field
from typing import List, Any

load_dotenv()

class TradingAgent(BaseModel):
    name: str
    wallet: str
    transaction_history: List[Any] = Field(default_factory=list)

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
        return response.choices[0].message.content

    def execute_trade(self, action, amount, asset, market_data):
        if action == "BUY":
            self.transfer_asset(amount, asset, "buyer_wallet_address")
            self.log_transaction(action, amount, asset, market_data[asset]['price'])
        elif action == "SELL":
            self.transfer_asset(amount, asset, "seller_wallet_address")
            self.log_transaction(action, amount, asset, market_data[asset]['price'])

    def transfer_asset(self, amount, asset_id, destination_address):
        try:
            transfer = self.wallet.transfer(amount, asset_id, destination_address)
            transfer.wait()
        except Exception as e:
            print(f"Error transferring asset: {str(e)}")

    def log_transaction(self, action, amount, asset, price, timestamp=None):
        if timestamp is None:
            timestamp = datetime.now().isoformat()
        transaction = {"action": action, "amount": amount, "asset": asset, "price": price, "timestamp": timestamp}
        self.transaction_history.append(transaction)

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
            portfolio_value += data['price']
        profit_or_loss = total_received - total_spent
        return profit_or_loss, portfolio_value

    def auto_trade(self, market_data):
        advice = self.analyze_market(market_data)
        if "BUY" in advice.upper():
            self.execute_trade("BUY", 0.001, "BTC", market_data)
        elif "SELL" in advice.upper():
            self.execute_trade("SELL", 0.001, "BTC", market_data)

def fetch_market_data():
    user_data = {"tweet_analysis": [{"coin_name": "bitcoin", "coin_review": 1}]}
    market_data = {}
    for analysis in user_data['tweet_analysis']:
        price = 20000  # Mock price
        market_data[analysis['coin_name'].upper()] = {"price": price, "sentiment": analysis['coin_review']}
    return market_data

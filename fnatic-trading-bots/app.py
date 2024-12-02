from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import json
import os
from datetime import datetime
from bot import TradingAgent, fetch_market_data
from main import get_coin_data

app = Flask(__name__)
CORS(app)

# Global variables
bot_thread = None
bot_running = False
trading_agent = None

# Initialize wallet and agent
def init_agent():
    global trading_agent
    from cdp import Wallet, Cdp
    API_KEY_NAME = os.environ.get("CDP_API_KEY_NAME")
    PRIVATE_KEY = os.environ.get("CDP_PRIVATE_KEY", "").replace('\\n', '\n')
    Cdp.configure(API_KEY_NAME, PRIVATE_KEY)
    agent_wallet = Wallet.create()
    trading_agent = TradingAgent(name="Agent1", wallet=agent_wallet)

# Background bot logic
def run_bot():
    global bot_running
    while bot_running:
        try:
            market_data = fetch_market_data()
            trading_agent.auto_trade(market_data)
        except Exception as e:
            print(f"Error during bot execution: {e}")
        # Add a delay to simulate periodic trading (e.g., every 60 seconds)
        import time
        time.sleep(60)

# Flask Endpoints
@app.route('/start', methods=['POST'])
def start_bot():
    global bot_thread, bot_running, trading_agent
    if bot_running:
        return jsonify({"status": "Bot is already running."}), 400
    
    bot_running = True
    init_agent()
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()
    return jsonify({"status": "Bot started successfully."})

@app.route('/stop', methods=['POST'])
def stop_bot():
    global bot_running
    if not bot_running:
        return jsonify({"status": "Bot is not running."}), 400
    
    bot_running = False
    bot_thread.join()
    save_transactions()
    return jsonify({"status": "Bot stopped and transactions saved."})

@app.route('/transactions', methods=['GET'])
def get_transactions():
    if not trading_agent:
        return jsonify({"status": "Bot not initialized."}), 400
    
    return jsonify(trading_agent.transaction_history)

@app.route('/save', methods=['POST'])
def save_transactions():
    if not trading_agent:
        return jsonify({"status": "Bot not initialized."}), 400
    
    try:
        with open("transactions.json", "w") as f:
            json.dump(trading_agent.transaction_history, f, indent=4)
        return jsonify({"status": "Transactions saved successfully."})
    except Exception as e:
        return jsonify({"status": f"Error saving transactions: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)

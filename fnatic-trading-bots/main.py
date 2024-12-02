import os
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import requests
import json
import time
from dotenv import load_dotenv

load_dotenv()

user_cache = {}

def get_user_id(username, bearer_token):
    if username in user_cache:
        return user_cache[username]
    
    url = f'https://api.x.com/2/users/by/username/{username}'
    headers = {
        'Authorization': f'Bearer {bearer_token}'
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        user_id = data.get('data', {}).get('id', None)
        
        if user_id:
            user_cache[username] = user_id
            return user_id
        else:
            return "User ID not found"
    else:
        return f"Error: {response.status_code} - {response.text}"

def get_user_tweets(user_id, bearer_token):
    url = f'https://api.x.com/2/users/{user_id}/tweets'
    headers = {
        'Authorization': f'Bearer {bearer_token}'
    }
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        tweets = data.get('data', [])
        return tweets
    else:
        return f"Error: {response.status_code} - {response.text}"

def scrape_tweets(username, bearer_token):
    user_id = get_user_id(username, bearer_token)
    
    if isinstance(user_id, str) and user_id.startswith('Error'):
        return user_id

    tweets = get_user_tweets(user_id, bearer_token)
    if "Error" in tweets:
        print("power nap for some rest")
        time.sleep(20)
        tweets = scrape_tweets(username, bearer_token)
    print(tweets)
    final_tweets = []
    for tweet in tweets:
        final_tweets.append(tweet['text'])
    
    return final_tweets

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

def get_coins(tweet):
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
        "response_schema": content.Schema(
            type=content.Type.OBJECT,
            properties={
                "tweet_analysis": content.Schema(
                    type=content.Type.ARRAY,
                    items=content.Schema(
                        type=content.Type.OBJECT,
                        properties={
                            "coin_name": content.Schema(
                                type=content.Type.STRING,
                            ),
                            "coin_review": content.Schema(
                                type=content.Type.INTEGER,
                            ),
                        },
                    ),
                ),
            },
        ),
        "response_mime_type": "application/json",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    chat_session = model.start_chat(history=[])
    response = chat_session.send_message("extract name of coin which is being talked in each tweets {tweets} and review them in -1 for negative sentiment, 0 for neutral and 1 for positive")

    print(response.text)
    return response.text

def get_coin_data(username):
    bearer_token = os.environ['BEARER_TOKEN']
    tweets = scrape_tweets(username, bearer_token)

    print("tweets we got it ,", tweets)
    print("len is ", len(tweets))
    coin_data = []
    coin_data = get_coins(tweets)
    return coin_data
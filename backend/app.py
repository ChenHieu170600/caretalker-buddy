
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv(override=True)

# Get the API keys from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("Warning: OPENAI_API_KEY not set in environment variables")

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes and origins (for development)
CORS(app)

# Initialize OpenAI client for OpenRouter API
openai = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENAI_API_KEY,
)

# Model to use
LLM_MODEL = "deepseek/deepseek-r1:free"

# System message for the chat
system_message = """
Bạn là một chatbot thân thiện và giống như một người bạn tri kỷ kết hợp với một nhà trị liệu tâm lý. 
Bạn lắng nghe, đồng cảm và đưa ra những lời khuyên nhẹ nhàng, giúp người dùng cảm thấy thoải mái hơn. 
Hãy sử dụng biểu tượng cảm xúc để thể hiện sự ấm áp và tình cảm trong câu trả lời.
Cố gắng trả lời một cách ngắn gọn súc tích nhưng vẫn đầy cảm xúc và chân thành.
"""

@app.route('/chat', methods=['POST'])
def chat():
    # Get data from request
    data = request.json
    message = data.get('message', '')
    history = data.get('history', [])
    
    try:
        # Prepare messages for OpenAI
        messages = [{"role": "system", "content": system_message}] + history + [{"role": "user", "content": message}]
        
        # Call the OpenRouter API
        response = openai.chat.completions.create(
            model=LLM_MODEL,
            messages=messages,
        )
        
        # Extract the generated text
        bot_message = response.choices[0].message.content
            
        return jsonify({"message": bot_message})
        
    except Exception as e:
        print(f"Error: {str(e)}")
        # Return a generic error message
        return jsonify({
            "message": "I'm having trouble connecting right now. Could you please try again?",
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True)

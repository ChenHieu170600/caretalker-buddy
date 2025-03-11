
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the Hugging Face API key from environment variables
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
if not HUGGINGFACE_API_KEY:
    print("Warning: HUGGINGFACE_API_KEY not set in environment variables")

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes and origins (for development)
CORS(app)

# Models to use for different categories
MODELS = {
    "general": "facebook/blenderbot-400M-distill",
    "anxiety": "facebook/blenderbot-400M-distill",
    "depression": "facebook/blenderbot-400M-distill",
    "stress": "facebook/blenderbot-400M-distill"
}

@app.route('/chat', methods=['POST'])
def chat():
    # Get data from request
    data = request.json
    message = data.get('message', '')
    category = data.get('category', 'general')
    
    # Choose the model based on the category
    model = MODELS.get(category, MODELS['general'])
    
    try:
        # Make a request to the Hugging Face API
        api_url = f"https://api-inference.huggingface.co/models/{model}"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        payload = {"inputs": {"text": message}}
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        
        # Parse the response
        result = response.json()
        
        # Extract the generated text (the response format can vary by model)
        if isinstance(result, list) and len(result) > 0:
            if 'generated_text' in result[0]:
                bot_message = result[0]['generated_text']
            else:
                bot_message = str(result[0])
        else:
            bot_message = str(result)
            
        return jsonify({"message": bot_message, "category": category})
        
    except Exception as e:
        print(f"Error: {str(e)}")
        # Return a generic error message
        return jsonify({
            "message": "I'm having trouble understanding right now. Could you please try again?",
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True)

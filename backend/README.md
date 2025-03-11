
# MindfulCompanion Python Backend

This is the Python backend for the MindfulCompanion application. It uses Flask to create a simple API that communicates with the Hugging Face API to generate responses for the chatbot.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your Hugging Face API key:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

5. Run the Flask app:
   ```
   python app.py
   ```

The backend will be available at http://localhost:5000.

## API Endpoints

- `POST /chat`: Send a message to the chatbot
  - Request body: `{ "message": "Your message here", "category": "general" }`
  - Response: `{ "message": "Bot response here", "category": "general" }`

- `GET /health`: Check if the API is running
  - Response: `{ "status": "healthy" }`

## Getting a Hugging Face API Key

1. Create an account on [Hugging Face](https://huggingface.co/)
2. Go to your profile settings
3. Navigate to "Access Tokens"
4. Create a new token with "read" access
5. Copy the token and add it to your `.env` file

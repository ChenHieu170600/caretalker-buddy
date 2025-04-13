
import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import openai
import sys
import logging
from pathlib import Path
import uuid
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the backend directory to the Python path
backend_dir = str(Path(__file__).parent.parent)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

from personas import PERSONAS, DEFAULT_PERSONA
from config import AVAILABLE_MODELS, OPENAI_API_KEY, OPENAI_BASE_URL

class ChatService:
    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.base_url = OPENAI_BASE_URL
        logger.info(f"Initializing ChatService with base_url: {self.base_url}")
        logger.info(f"API Key present: {'Yes' if self.api_key else 'No'}")
        
        # Initialize OpenAI client with OpenRouter headers
        self.client = openai.OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
            default_headers={
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "Mindful Companion"
            }
        )
        
        # Store conversations with their messages
        self.conversations = {}
        self.current_conversation_id = None
        self.current_persona = DEFAULT_PERSONA
        self.available_models = AVAILABLE_MODELS
        self.current_model = AVAILABLE_MODELS[0]  # Set first model as default

        # Create data directory if it doesn't exist
        self.data_dir = os.path.join(backend_dir, 'data')
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
        
        # Load existing conversations
        self.load_conversations()

    def set_model(self, model: str) -> bool:
        if model in self.available_models:
            self.current_model = model
            return True
        return False

    def get_available_models(self) -> List[str]:
        return self.available_models

    def get_current_model(self) -> str:
        return self.current_model

    def set_persona(self, persona_id: str) -> bool:
        if persona_id in PERSONAS:
            self.current_persona = persona_id
            return True
        return False

    def get_current_persona(self) -> str:
        return self.current_persona

    def get_personas(self) -> Dict[str, Dict[str, str]]:
        return {
            key: {"name": value["name"], "description": value["description"]}
            for key, value in PERSONAS.items()
        }

    def create_new_conversation(self) -> str:
        """Create a new conversation and return its ID"""
        conversation_id = str(uuid.uuid4())
        self.current_conversation_id = conversation_id
        self.conversations[conversation_id] = {
            'messages': [],
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'title': 'New Conversation'
        }
        self.save_conversations()
        return conversation_id

    def set_current_conversation(self, conversation_id: str) -> bool:
        """Set the current conversation ID"""
        if conversation_id in self.conversations:
            self.current_conversation_id = conversation_id
            return True
        return False

    def get_current_conversation(self) -> Dict:
        """Get the current conversation"""
        if not self.current_conversation_id or self.current_conversation_id not in self.conversations:
            self.create_new_conversation()
        return self.conversations[self.current_conversation_id]

    def get_all_conversations(self) -> Dict[str, Dict]:
        """Get all conversations"""
        return self.conversations

    def add_message(self, role: str, content: str) -> None:
        """Add a message to the current conversation"""
        if not self.current_conversation_id or self.current_conversation_id not in self.conversations:
            self.create_new_conversation()
            
        # Update conversation with new message
        self.conversations[self.current_conversation_id]['messages'].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().timestamp()
        })
        
        # Update the conversation title if it's the first user message
        messages = self.conversations[self.current_conversation_id]['messages']
        if len(messages) == 1 and role == "user":
            # Use the first 30 characters of the message as the title
            title = content[:30] + "..." if len(content) > 30 else content
            self.conversations[self.current_conversation_id]['title'] = title
        
        self.conversations[self.current_conversation_id]['updated_at'] = datetime.now().isoformat()
        self.save_conversations()

    def clear_history(self) -> None:
        """Clear the current conversation history"""
        if self.current_conversation_id and self.current_conversation_id in self.conversations:
            self.conversations[self.current_conversation_id]['messages'] = []
            self.conversations[self.current_conversation_id]['updated_at'] = datetime.now().isoformat()
            self.save_conversations()

    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            if self.current_conversation_id == conversation_id:
                self.current_conversation_id = next(iter(self.conversations)) if self.conversations else None
            self.save_conversations()
            return True
        return False

    def get_history(self) -> List[Dict[str, Any]]:
        """Get message history for the current conversation"""
        if not self.current_conversation_id or self.current_conversation_id not in self.conversations:
            return []
        return self.conversations[self.current_conversation_id]['messages']

    def save_conversations(self):
        """Save conversations to disk"""
        try:
            file_path = os.path.join(self.data_dir, 'conversations.json')
            with open(file_path, 'w') as f:
                json.dump(self.conversations, f, default=str)
            logger.info(f"Saved conversations to {file_path}")
        except Exception as e:
            logger.error(f"Error saving conversations: {e}")

    def load_conversations(self):
        """Load conversations from disk"""
        try:
            file_path = os.path.join(self.data_dir, 'conversations.json')
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    self.conversations = json.load(f)
                logger.info(f"Loaded {len(self.conversations)} conversations from {file_path}")
                if self.conversations:
                    # Set the most recently updated conversation as current
                    sorted_convs = sorted(
                        self.conversations.items(), 
                        key=lambda x: x[1].get('updated_at', ''),
                        reverse=True
                    )
                    self.current_conversation_id = sorted_convs[0][0]
        except Exception as e:
            logger.error(f"Error loading conversations: {e}")
            self.conversations = {}
            self.current_conversation_id = None

    def generate_response(self, message: str, model: Optional[str] = None, conversation_id: Optional[str] = None) -> Dict[str, Any]:
        # Set conversation ID if provided
        if conversation_id and conversation_id in self.conversations:
            self.current_conversation_id = conversation_id
        elif not self.current_conversation_id or self.current_conversation_id not in self.conversations:
            self.create_new_conversation()
        
        # Add user message to history
        self.add_message("user", message)
        
        # Use provided model or current model
        model_to_use = model if model else self.current_model
        
        # Get system message for current persona
        system_message = PERSONAS[self.current_persona]["system_message"]
        logger.info(f"Using persona: {self.current_persona}")
        logger.info(f"System prompt: {system_message}")
        
        # Prepare messages for API call
        messages = [
            {"role": "system", "content": system_message}
        ]
        
        # Add history messages
        for msg in self.get_history():
            messages.append({"role": msg["role"], "content": msg["content"]})
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=model_to_use,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            # Log the response
            logger.info(f"API Response: {response}")
            
            # Check if the response is None
            if response is None:
                logger.error("Received None response from OpenRouter API.")
                return {
                    "error": "Error: No response from the API.",
                    "history": self.get_history(),
                    "conversation_id": self.current_conversation_id
                }
            
            # Extract response content
            response_content = response.choices[0].message.content
            
            # Add assistant message to history
            self.add_message("assistant", response_content)
            
            return {
                "message": response_content,
                "history": self.get_history(),
                "conversation_id": self.current_conversation_id,
                "conversations": {
                    conv_id: {
                        "title": data.get("title", "Untitled"),
                        "updated_at": data.get("updated_at")
                    } for conv_id, data in self.conversations.items()
                }
            }
            
        except Exception as e:
            error_message = f"Error generating response: {str(e)}"
            logger.error(error_message)
            return {
                "error": error_message,
                "history": self.get_history(),
                "conversation_id": self.current_conversation_id
            }

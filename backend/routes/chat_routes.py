
from flask import Blueprint, request, jsonify, Response
import logging
from services.chat_service import ChatService
from config import AVAILABLE_MODELS, DEFAULT_MODEL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)
chat_service = ChatService()

@chat_bp.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return Response(status=200)
        
    data = request.json
    if not data or 'message' not in data:
        return jsonify({
            "message": "Invalid request format",
            "error": "Missing message in request body"
        }), 400

    try:
        logger.info(f"Received chat request with message: {data['message'][:50]}...")
        
        # Get model and conversation ID from request
        model = data.get('model', chat_service.get_current_model())
        conversation_id = data.get('conversation_id')
        logger.info(f"Using model: {model}, conversation_id: {conversation_id}")
        
        response = chat_service.generate_response(
            message=data['message'],
            model=model,
            conversation_id=conversation_id
        )
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error in chat route: {str(e)}", exc_info=True)
        return jsonify({
            "message": "I'm having trouble connecting right now. Could you please try again?",
            "error": str(e)
        }), 500

@chat_bp.route('/models', methods=['GET'])
def get_models():
    return jsonify({
        "models": AVAILABLE_MODELS,
        "current_model": chat_service.get_current_model()
    })

@chat_bp.route('/set-model', methods=['POST'])
def set_model():
    data = request.json
    if not data or 'model' not in data:
        return jsonify({
            "message": "Invalid request format",
            "error": "Missing model in request body"
        }), 400
    
    logger.info(f"Setting model to: {data['model']}")
    if chat_service.set_model(data['model']):
        return jsonify({
            "message": "Model updated successfully",
            "current_model": chat_service.get_current_model()
        })
    else:
        return jsonify({
            "message": "Invalid model",
            "error": f"Model {data['model']} is not available"
        }), 400

@chat_bp.route('/clear-history', methods=['POST'])
def clear_history():
    chat_service.clear_history()
    return jsonify({
        "message": "Chat history cleared",
        "history": chat_service.get_history()
    })

@chat_bp.route('/personas', methods=['GET'])
def get_personas():
    return jsonify({
        "personas": chat_service.get_personas(),
        "current_persona": chat_service.get_current_persona()
    })

@chat_bp.route('/set-persona', methods=['POST'])
def set_persona():
    data = request.json
    if not data or 'persona' not in data:
        return jsonify({
            "message": "Invalid request format",
            "error": "Missing persona in request body"
        }), 400
    
    if chat_service.set_persona(data['persona']):
        return jsonify({
            "message": "Persona updated successfully",
            "current_persona": chat_service.get_current_persona()
        })
    else:
        return jsonify({
            "message": "Invalid persona",
            "error": f"Persona {data['persona']} is not available"
        }), 400

@chat_bp.route('/conversations', methods=['GET'])
def get_conversations():
    conversations = chat_service.get_all_conversations()
    formatted_conversations = {
        conv_id: {
            "title": data.get("title", "Untitled"),
            "updated_at": data.get("updated_at")
        } for conv_id, data in conversations.items()
    }
    return jsonify({
        "conversations": formatted_conversations,
        "current_conversation": chat_service.current_conversation_id
    })

@chat_bp.route('/conversation', methods=['POST'])
def create_conversation():
    conversation_id = chat_service.create_new_conversation()
    return jsonify({
        "message": "New conversation created",
        "conversation_id": conversation_id
    })

@chat_bp.route('/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    if conversation_id in chat_service.conversations:
        chat_service.set_current_conversation(conversation_id)
        return jsonify({
            "messages": chat_service.get_history(),
            "conversation_id": conversation_id,
            "title": chat_service.conversations[conversation_id].get("title", "Untitled")
        })
    else:
        return jsonify({
            "message": "Conversation not found",
            "error": f"Conversation {conversation_id} does not exist"
        }), 404

@chat_bp.route('/conversation/<conversation_id>', methods=['DELETE'])
def delete_conversation(conversation_id):
    if chat_service.delete_conversation(conversation_id):
        return jsonify({
            "message": "Conversation deleted",
            "current_conversation": chat_service.current_conversation_id
        })
    else:
        return jsonify({
            "message": "Failed to delete conversation",
            "error": f"Conversation {conversation_id} does not exist"
        }), 404

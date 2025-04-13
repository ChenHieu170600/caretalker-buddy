
/**
 * API service for communicating with the Python backend
 */

// Base URL for the backend API
// In production, you would use an environment variable for this
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for the response from the backend
interface ApiResponse {
  message: string;
  error?: string;
  conversation_id?: string;
  conversations?: Record<string, {
    title: string;
    updated_at: string;
  }>;
}

// Interface for the models response
interface ModelsResponse {
  models: string[];
  current_model: string;
}

// Interface for conversations response
interface ConversationsResponse {
  conversations: Record<string, {
    title: string;
    updated_at: string;
  }>;
  current_conversation: string;
}

/**
 * Send a message to the backend API and get a response
 * @param message The user's message
 * @param model The model to use for generating the response
 * @param conversationId Optional conversation ID
 * @returns A promise that resolves to the API response
 */
export const sendMessageToBackend = async (
  message: string,
  model?: string,
  conversationId?: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, model, conversation_id: conversationId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message to backend:', error);
    return {
      message: "I'm having trouble connecting to my backend. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Get the available models from the backend
 * @returns A promise that resolves to the models response
 */
export const getAvailableModels = async (): Promise<ModelsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching models:', error);
    return {
      models: [],
      current_model: '',
    };
  }
};

/**
 * Get all conversations from the backend
 * @returns A promise that resolves to the conversations response
 */
export const getConversations = async (): Promise<ConversationsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return {
      conversations: {},
      current_conversation: '',
    };
  }
};

/**
 * Create a new conversation
 * @returns A promise that resolves to the API response with the new conversation ID
 */
export const createNewConversation = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating new conversation:', error);
    return {
      message: "Failed to create a new conversation",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Delete a conversation
 * @param conversationId The ID of the conversation to delete
 * @returns A promise that resolves to the API response
 */
export const deleteConversation = async (conversationId: string): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return {
      message: "Failed to delete conversation",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Load a specific conversation
 * @param conversationId The ID of the conversation to load
 * @returns A promise that resolves to the conversation data
 */
export const loadConversation = async (conversationId: string): Promise<{
  messages: any[];
  conversation_id: string;
  title: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversation/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading conversation:', error);
    return {
      messages: [],
      conversation_id: '',
      title: 'Error loading conversation'
    };
  }
};

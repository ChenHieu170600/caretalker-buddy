
/**
 * API service for communicating with the Python backend
 */

// Base URL for the backend API
// In production, you would use an environment variable for this
const API_BASE_URL = 'http://localhost:5000';

// Interface for the response from the backend
interface ApiResponse {
  message: string;
  error?: string;
}

/**
 * Send a message to the backend API and get a response
 * @param message The user's message
 * @returns A promise that resolves to the API response
 */
export const sendMessageToBackend = async (
  message: string
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
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

# Mindful Companion

A modern chat application that provides AI-powered companionship and support through various personas.

## Features

- Multiple AI personas for different types of support and conversation
- Real-time chat interface with markdown support
- Modern, responsive UI built with Next.js and Tailwind CSS
- Flask backend with OpenAI/OpenRouter integration
- Secure API key management

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key or OpenRouter API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mindful-companion.git
cd mindful-companion
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_api_key_here
```

5. Start the development servers:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
python app.py
```

The application will be available at `http://localhost:3000`

## Project Structure

```
mindful-companion/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── personas.py
│   └── services/
│       └── chat_service.py
├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
├── public/
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# Mindfull-Companion
"# Mindfull-Companion" 

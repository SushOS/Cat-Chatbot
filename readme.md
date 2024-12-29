# Cat Chatbot

A React and Node.js application that uses OpenAI's GPT-4o-mini LLM, OpenAI API and The Cat API to create an interactive **Cat breed information Chatbot.**

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- OpenAI API Key
- The Cat API Key

## Environment Setup

1. Clone the repository:
```bash
git clone git@github.com:SushOS/Cat-Chatbot.git
cd Cat-Chatbot
```

2. Create .env file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key
CAT_API_KEY=your_cat_api_key
PORT=3001
```

## Running the Application
### Method 1 - Running with Docker (Recommended)

1. Build and Start the containers
```bash
docker-compose up --build
```
- The application will be available at:

    - Frontend: http://localhost:3000
    - Backend: http://localhost:3001

2. To stop the application:
```bash
docker-compose down
```

### Method 2 - Running Locally (Development)

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```
## Project Structure
```bash
Directory structure:
└── SushOS-Cat-Chatbot/
    ├── backend/
    │   ├── .gitignore
    │   ├── package.json
    │   ├── .dockerignore
    │   ├── Dockerfile
    │   ├── package-lock.json
    │   └── src/
    │       ├── controllers/
    │       │   └── chatController.js
    │       ├── services/
    │       │   ├── catApiService.js
    │       │   └── openaiService.js
    │       ├── server.js
    │       ├── config/
    │       │   └── config.js
    │       └── routes/
    │           └── api.js
    ├── frontend/
    │   ├── .gitignore
    │   ├── public/
    │   │   └── index.html
    │   ├── package.json
    │   ├── .dockerignore
    │   ├── .babelrc
    │   ├── webpack.config.js
    │   ├── Dockerfile
    │   ├── tsconfig.json
    │   ├── package-lock.json
    │   └── src/
    │       ├── App.tsx
    │       ├── services/
    │       │   └── api.ts
    │       ├── components/
    │       │   ├── ChatInput.tsx
    │       │   ├── BreedSelector.tsx
    │       │   ├── ChatMessage.tsx
    │       │   └── Chat.tsx
    │       ├── index.tsx
    │       └── types/
    │           └── index.ts
    ├── readme.md
    └── docker-compose.yml

```

## Features
- Interactive chat interface
- Real-time cat breed information
- Dynamic cat image display
- Breed selection functionality
- Docker containerization
- TypeScript support
- Hot reloading for development

## Technologies Used
1. Frontend:
```bash
- React
- TypeScript
- Webpack
- Babel
- Axios
- Emotion (styled-components)
```
2. Backend:
```bash
- Node.js
- Express
- OpenAI API
- The Cat API
- Development:
- Docker
- TypeScript
- Webpack
- Babel
```

# Nexa AI — Full-Stack Production AI Assistant

A modern, production-grade full-stack AI Assistant built with the **MERN Stack** (MongoDB, Express.js, React, Node.js) and integrated with OpenAI's large language models.

---

## 🚀 Live Demo & Deployment

- **Frontend Deployment Platform**: [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fnexa-ai&root-directory=client)
- **Production Architecture**:
  - **Client (SPA)**: Vercel / Netlify
  - **Server (REST API)**: Render / Railway / AWS / Vercel Serverless
  - **Database**: MongoDB Atlas

---

## ✨ Features

### 🔐 Enterprise-Grade Authentication & Security
- **Secure Password Hashing**: Utilizes `bcryptjs` with auto-salting hooks.
- **JWT & HTTP-Only Cookies**: Protected against cross-site scripting (XSS) token theft.
- **Strict Data Isolation**: Zero-trust multi-tenant isolation where queries strictly enforce `user: req.user._id`.
- **API Rate Limiting**: Built-in IP rate limiter preventing abuse and quota depletion on `/api/chat`.
- **CORS & Input Validation**: Strict payload filtering, sanitized strings, and safe CORS origin reflection.

### 🤖 Intelligent AI Chat Experience
- **OpenAI LLM Integration**: Server-side client isolation ensuring the API key is never exposed to the client.
- **Automated Title Generation**: Analyzes initial user prompt to dynamically produce concise, descriptive conversation titles.
- **Context Preservation**: Rolling sliding-window history buffer providing coherent multi-turn conversations.
- **Markdown & Code Rendering**: GitHub Flavored Markdown (GFM), lists, tables, blockquotes, and copyable syntax-highlighted code blocks.
- **Typing Indicator & Optimistic UI**: Immediate local message dispatch with smooth animated bounce indicator.
- **Conversation Management**: Create new chats, rename active sessions inline, delete past histories, and browse recent threads.

---

## 🏗️ Architecture & Directory Layout

```text
nexa-ai/
│
├── client/                      # React 18 + Vite + Tailwind CSS Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx       # Top navigation & mobile drawer trigger
│   │   │   │   ├── ProtectedRoute.jsx# Auth route guard
│   │   │   │   └── Sidebar.jsx      # Conversation history, rename & delete
│   │   │   ├── ChatInput.jsx        # Auto-resizing textarea with keyboard shortcuts
│   │   │   └── ChatMessage.jsx      # Markdown parser & code block copy handler
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global session & user authentication state
│   │   ├── lib/
│   │   │   └── api.js               # Axios instance with credentials & interceptors
│   │   ├── pages/
│   │   │   ├── Chat.jsx             # Main interactive chat workspace
│   │   │   ├── Login.jsx            # Sign-in portal
│   │   │   ├── Register.jsx         # Sign-up portal
│   │   │   └── Settings.jsx         # System architecture & user profile
│   │   ├── services/
│   │   │   ├── authService.js       # Auth API client
│   │   │   └── chatService.js       # Conversation & AI API client
│   │   ├── App.jsx                  # Main router configuration
│   │   ├── index.css                # Tailwind directives & custom scrollbars
│   │   └── main.jsx                 # React root bootstrap
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json                  # SPA rewrite rules for Vercel
│   └── vite.config.js
│
├── server/                      # Node.js + Express.js REST API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                # Mongoose connection & disconnect listeners
│   │   ├── controllers/
│   │   │   ├── ai.controller.js     # Chat orchestration & title generation
│   │   │   ├── auth.controller.js   # Register, login, cookie generation, logout
│   │   │   └── conversation.controller.js # Multi-tenant CRUD operations
│   │   ├── middleware/
│   │   │   ├── auth.js              # Cookie / Bearer token JWT validator
│   │   │   ├── errorHandler.js      # Centralized error formatter
│   │   │   └── notFound.js          # Unmatched route handler
│   │   ├── models/
│   │   │   ├── Conversation.js      # Compound-indexed conversation schema
│   │   │   └── User.js              # User schema with pre-save bcrypt hook
│   │   ├── routes/
│   │   │   ├── ai.routes.js         # Protected /api/chat endpoint
│   │   │   ├── auth.routes.js       # Public & protected auth endpoints
│   │   │   └── conversation.routes.js # Conversation endpoints
│   │   ├── services/
│   │   │   ├── ai.service.js        # OpenAI SDK integration
│   │   │   └── conversation.service.js # Database queries & updates
│   │   ├── utils/
│   │   │   └── asyncHandler.js      # Promise wrapper
│   │   ├── validators/
│   │   │   └── auth.validator.js    # Payload sanitization & validation
│   │   └── server.js                # Express app configuration & listener
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas or local MongoDB URI
MONGODB_URI=mongodb://127.0.0.1:27017/nexa_ai

# Long cryptographically secure secret (minimum 32 characters)
JWT_SECRET=nexa_ai_super_secret_jwt_key_change_in_production_9876543210
JWT_EXPIRES_IN=7d

# Allowed frontend client URL for CORS & Cookie sharing
CLIENT_URL=http://localhost:5173

# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-yourOpenAiKeyHere
OPENAI_MODEL=gpt-4o-mini
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later
- **MongoDB**: Local MongoDB community server or MongoDB Atlas cluster URI
- **OpenAI API Key**: Obtainable from [OpenAI Platform](https://platform.openai.com/api-keys)

### Step 1: Clone or Navigate to the Workspace
```powershell
cd C:\Users\Lenovo\.gemini\antigravity\scratch\nexa-ai
```

### Step 2: Configure Environment Files
```powershell
# Copy backend template
Copy-Item .\server\.env.example .\server\.env

# Copy frontend template
Copy-Item .\client\.env.example .\client\.env
```
*Open `server/.env` and update `OPENAI_API_KEY` and `MONGODB_URI`.*

### Step 3: Start the Backend Server
In Terminal 1:
```powershell
cd server
npm run dev
```
*Server starts on `http://localhost:5000`.*

### Step 4: Start the Frontend Client
In Terminal 2:
```powershell
cd client
npm run dev
```
*Client starts on `http://localhost:5173`.*

---

## 📡 REST API Reference

### Authentication

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user, issue JWT cookie |
| `POST` | `/api/auth/login` | Public | Validate credentials, issue JWT cookie |
| `POST` | `/api/auth/logout` | Public | Invalidate & clear auth cookie |
| `GET` | `/api/auth/me` | Private | Retrieve active authenticated session |

#### Register Payload Example
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### Conversations

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/conversations` | Private | Fetch all user conversations (newest first) |
| `POST` | `/api/conversations` | Private | Create an empty conversation |
| `GET` | `/api/conversations/:id` | Private | Retrieve full conversation messages |
| `PATCH` | `/api/conversations/:id` | Private | Update conversation title |
| `DELETE`| `/api/conversations/:id` | Private | Delete conversation |

### AI Chat

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | Private | Send prompt, receive AI response & persist |

#### Chat Request Payload Example
```json
{
  "conversationId": "651d9f8b2c8a1e2f3d4c5b6a", // Or omit for new chat
  "message": "Explain how MongoDB compound indexes optimize query sorting."
}
```

#### Chat Response Example
```json
{
  "success": true,
  "isNewConversation": false,
  "conversationId": "651d9f8b2c8a1e2f3d4c5b6a",
  "conversation": { ... },
  "reply": {
    "role": "assistant",
    "content": "MongoDB compound indexes support queries matching multiple fields...",
    "createdAt": "2026-10-02T02:30:00.000Z"
  }
}
```

---

## 🚀 Deploying to Vercel

### Option A: Direct One-Click Deploy
1. Push your repository to GitHub (instructions below).
2. Visit:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fnexa-ai&root-directory=client)
3. Set the **Root Directory** to `client`.
4. In **Environment Variables**, set:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://nexa-ai-api.onrender.com/api`)
5. Click **Deploy**.

### Option B: Deploying via Vercel CLI
```powershell
cd client
npm i -g vercel
vercel
```

### Backend Deployment (Render / Railway)
1. Create a Web Service connected to your repository with root directory `server`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=<your MongoDB Atlas connection string>`
   - `JWT_SECRET=<strong random string>`
   - `CLIENT_URL=https://your-nexa-app.vercel.app`
   - `OPENAI_API_KEY=<your OpenAI key>`
   - `OPENAI_MODEL=gpt-4o-mini`

---

## 🛠️ Troubleshooting & Debugging

| Error | Common Cause | Resolution |
| :--- | :--- | :--- |
| `ECONNREFUSED 127.0.0.1:27017` | Local MongoDB server is not running | Start MongoDB service or provide a free cloud MongoDB Atlas URI in `server/.env`. |
| `CORS error` | Frontend origin does not match `CLIENT_URL` | Ensure `CLIENT_URL` in `server/.env` exactly matches the client port (e.g. `http://localhost:5173`). |
| `401 Unauthorized` | Missing or expired token | Log out and re-authenticate; ensure `withCredentials: true` is enabled in Axios. |
| `Invalid OpenAI API Key` | Key is missing or invalid in `server/.env` | Verify your OpenAI dashboard key and ensure no extra quotes or whitespaces. |
| `Cookie not being stored` | Cross-site cookie blocked without HTTPS | In production, cookies require `secure: true` and `sameSite: 'none'`. For local HTTP development, `server/src/controllers/auth.controller.js` automatically uses `secure: false` and `sameSite: 'lax'`. |

---

## 📦 Git & GitHub Workflow

Initialize and push to your GitHub repository:

```powershell
cd C:\Users\Lenovo\.gemini\antigravity\scratch\nexa-ai
git init
git add .
git commit -m "Initial commit: Production-grade Nexa AI Full-Stack Assistant"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nexa-ai.git
git push -u origin main
```

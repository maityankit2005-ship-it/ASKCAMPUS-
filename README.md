# AskCampus — AI FAQ Assistant

AskCampus is a beginner-friendly full-stack MERN (MongoDB, Express.js, React.js, Node.js) college FAQ platform. Students can ask campus-related questions about admissions, fees, scholarships, examinations, attendance, timetables, placements, campus facilities, and events. The backend searches the MongoDB FAQ database and uses an AI service (with a built-in database-matching fallback) to deliver clear, student-friendly answers.

## Features

- **Student Portal**
  - Register & log in securely with JWT access and refresh tokens.
  - Student Dashboard with quick question search, suggested categories, and recent questions.
  - AI Chat Assistant powered by MongoDB text search + AI API (with automatic DB fallback if no API key is configured).
  - Personal Chat History (students can only view their own conversations).
  - Profile page with logout.
- **Admin Portal**
  - Overview dashboard showing total students, total FAQs, total questions asked, and unanswered questions.
  - Full FAQ CRUD (create, edit, delete, filter by category, keyword search).
  - Analytics & Reports using MongoDB aggregation pipelines (most asked FAQs, popular categories, questions per student, unanswered questions).

## Technologies Used

- **Frontend:** React.js (Vite), React Router DOM, Context API, Fetch API, CSS3, Lucide React
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, bcryptjs, jsonwebtoken, dotenv, cors
- **AI Integration:** Backend Fetch API call to an OpenAI-compatible endpoint with automatic database FAQ matching fallback

## Folder Structure

```text
ask campus/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── faqController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── ChatMessage.js
│   │   ├── FAQ.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── faqRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── components/
│       │   ├── DashboardLayout.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminFAQs.jsx
│       │   ├── AdminReports.jsx
│       │   ├── ChatAssistant.jsx
│       │   ├── ChatHistory.jsx
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── RegisterPage.jsx
│       │   └── StudentDashboard.jsx
│       ├── utils/
│       │   └── api.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── docs/
│   └── DATABASE_SCHEMA.md
├── postman/
│   └── AskCampus_Postman_Collection.json
├── .gitignore
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on port `27017` (or a MongoDB Atlas URI)

### 1. Configure Backend Environment Variables
Create `backend/.env` from `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Update `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGO_URI`, and optionally `AI_API_KEY` in `backend/.env`.
Leave `AI_API_KEY` blank to use the built-in database FAQ matching fallback.

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Seed Admin Account & Sample FAQs
Set `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` in `backend/.env`, then run:

```bash
cd backend
npm run seed
```

This creates the initial admin user (never hardcoded in production) and seeds 16 realistic college FAQs across all 8 categories.

### 4. Run the Application
Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

## API Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new student |
| `POST` | `/api/auth/login` | Public | Login student or admin |
| `POST` | `/api/auth/refresh` | Public | Issue new access & refresh tokens |
| `POST` | `/api/auth/logout` | Public / Auth | Invalidate refresh token |
| `GET` | `/api/faqs` | Public | List/search/filter FAQs |
| `GET` | `/api/faqs/:id` | Public | Get single FAQ |
| `POST` | `/api/faqs` | Admin | Create FAQ |
| `PUT` | `/api/faqs/:id` | Admin | Update FAQ |
| `DELETE` | `/api/faqs/:id` | Admin | Delete FAQ |
| `POST` | `/api/chat/ask` | Authenticated | Ask question (AI + DB fallback) |
| `GET` | `/api/chat/history` | Authenticated | Get user's own chat history |
| `GET` | `/api/chat/history/:id` | Authenticated | Get single chat message |
| `GET` | `/api/admin/dashboard` | Admin | Dashboard stats & recent activity |
| `GET` | `/api/admin/reports` | Admin | MongoDB aggregation reports |
| `GET` | `/api/admin/unanswered` | Admin | List unanswered questions |

## Database Schema & Postman Testing
- See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for collection schemas and the ER diagram.
- Import [postman/AskCampus_Postman_Collection.json](postman/AskCampus_Postman_Collection.json) into Postman to test all endpoints.

# Accommodation MVP — CLAUDE.md

## Project Overview
A simple web app for finding and posting accommodation in Germany.
Target users: Students and working professionals.

## Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **File Upload:** Multer
- **Frontend:** HTML + CSS + Vanilla JS

## Folder Structure
```
accommodation-mvp/
├── server.js              ← Entry point, starts Express server
├── .env                   ← Secrets (MONGO_URI, JWT_SECRET, PORT)
├── .gitignore             ← Ignore node_modules, .env, uploads
├── package.json
│
├── config/
│   └── db.js              ← MongoDB connection logic
│
├── models/
│   ├── User.js            ← User schema (name, email, password, phone)
│   └── Room.js            ← Room schema (title, price, location, image, contact)
│
├── routes/
│   ├── authRoutes.js      ← POST /api/auth/register, POST /api/auth/login
│   └── roomRoutes.js      ← POST /api/rooms, GET /api/rooms, GET /api/rooms/:id
│
├── controllers/
│   ├── authController.js  ← Register and login logic
│   └── roomController.js  ← Post, list, search, view room logic
│
├── middleware/
│   └── authMiddleware.js  ← JWT verification, protects private routes
│
├── uploads/               ← Room images saved here by Multer
│
└── public/
    ├── pages/
    │   ├── index.html     ← Browse/search rooms
    │   ├── login.html     ← Login form
    │   ├── register.html  ← Register form
    │   ├── post-room.html ← Post a room (auth required)
    │   └── room.html      ← Single room detail + contact info
    ├── css/
    │   └── style.css      ← All styles
    └── js/
        └── main.js        ← fetch() calls to backend API
```

## API Endpoints

### Auth
| Method | Endpoint              | Auth | Description        |
|--------|-----------------------|------|--------------------|
| POST   | /api/auth/register    | No   | Register new user  |
| POST   | /api/auth/login       | No   | Login, get JWT     |

### Rooms
| Method | Endpoint              | Auth | Description             |
|--------|-----------------------|------|-------------------------|
| POST   | /api/rooms            | Yes  | Post a new room         |
| GET    | /api/rooms            | No   | List all / search rooms |
| GET    | /api/rooms/:id        | No   | View single room        |

## Environment Variables (.env)
```
MONGO_URI=mongodb://localhost:27017/accommodation
JWT_SECRET=your_random_secret_here
PORT=5000
```

## Local Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env file with values above

# 3. Start MongoDB
mongod

# 4. Start server
npm run dev

# 5. Open browser
http://localhost:5000/public/pages/index.html
```

## Key Rules for This Project
- Keep it simple — no extra features beyond MVP
- Never commit .env to git
- Always hash passwords with bcrypt before saving
- Always verify JWT in middleware, never in controllers
- Use multipart/form-data for room posting (image upload)
- Store JWT in localStorage on the frontend

## Common Errors Quick Reference
| Error                  | Fix                                      |
|------------------------|------------------------------------------|
| Cannot connect MongoDB | Run `mongod` in a separate terminal      |
| jwt malformed          | Send token as `Bearer <token>` in header |
| CORS error             | Add `app.use(cors())` in server.js       |
| Multer file missing    | Use `enctype="multipart/form-data"`      |
| .env not loading       | Add `require('dotenv').config()` at top  |

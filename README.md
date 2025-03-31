# 🛠 Config API – Express Backend

This is the backend API for the configuration management panel built for a case study.

It powers the mobile view by exposing a secure, read-only endpoint that returns the current config using an API key.

---

## ✨ Features

- RESTful API with Express
- API key-based authentication (for mobile access)
- Reads from Firestore using Firebase Admin SDK
- Structured for easy deployment to Render
- JSON response with config parameters
- Slightly edited response to match frontend requirements

---

## 📁 Project Structure

config-api/
├── src/
│   ├── firebase.js         # Firebase Admin SDK initialization
│   ├── routes/             # Express route handlers
│   └── index.js            # Main server entry point
├── serviceAccountKey.json  # Firebase service account key (not committed)
├── .env                    # Environment variables
└── README.md

---

## ⚙️ Environment Setup

1. Clone the repo

git clone https://github.com/your-username/config-api.git
cd config-api
npm install

2. Create `.env`

PORT=8080
API_KEY=your_api_key_here

3. Add Firebase Service Account

Save your downloaded `serviceAccountKey.json` file at the root of the project (not committed).

4. Start locally

npm run dev

---

## 🌐 API Endpoint

GET /api/config

- Secured with `x-api-key` header (value must match API_KEY from .env)
- Response: JSON object of config fields
- Example usage:

curl -H "x-api-key: your_api_key_here" https://your-api.onrender.com/api/config

---

## 🚀 Deployment

Deployed on **Render** using Node.js:

- Auto-deploys on push
- Runs `node src/index.js`

Live Endpoint:
https://your-api.onrender.com/api/config

---

## 🔒 Security

- All write access is handled by the admin panel using Firebase Auth.
- This API only exposes public read access via a valid API key.
- API key is stored securely in environment variables, not in source code.

---

## ✅ Tech Stack

- Node.js + Express
- Firebase Admin SDK
- Firestore
- Render for deployment

---

## 📌 Notes

- `.env` and `serviceAccountKey.json` are required but excluded from Git.
- Architecture allows future expansion (e.g., caching, rate limiting, role-based access).

---
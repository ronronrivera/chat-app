# 💬 Chat App



A **real-time chat application** built with the **MERN stack** (MongoDB, Express, React, Node.js) featuring **user authentication**, **image uploads**, and **notification sounds** for incoming messages.
---

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4336c8f6-ca2f-493a-a479-481ac119866b" />

URL: https://chat-app-iwxv3.sevalla.app/

## 🚀 Features

- ⚡ **Real-time messaging** using Socket.io  
- 🔐 **User authentication** with JWT  
- 🖼️ **Image upload support** via Cloudinary  
- 🔔 **Notification sound** for new messages  
- 📧 **Welcome email system** using Resend API  
- 🌙 **Modern UI** with responsive design (React + Tailwind)

---


## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Real-time | Socket.io |
| Email Service | Resend API |
| File Uploads | Cloudinary |
| Auth | JSON Web Tokens (JWT) |

---
🔑 Environment Variables

NODE_ENV=development

JWT_SECRET=myjwtsecret

RESEND_API_KEY=generate_your_own_api_key

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_own
CLOUDINARY_API_KEY=your_own
CLOUDINARY_API_SECRET=your_own_api

ARCJET_KEY=your_own
ARCJET_ENV=development


## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app

2️⃣ Install dependencies

cd backend
npm install

cd frontend
npm install


🧩 Running the App
cd backend
npm run dev

cd frontend
npm run dev


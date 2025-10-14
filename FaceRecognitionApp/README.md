# 🧠 SmartBrain – Face Detection App

SmartBrain is a simple full-stack face detection web app that uses the **Clarifai AI API** to detect human faces in images.  
Users can **sign up, sign in, submit an image URL or upload a file**, and the app will highlight detected faces directly on the image.

---

## 🚀 Live Demo  
👉 [View Deployed App](https://smartbrain-facerecognition-app.onrender.com/)

---

## ✨ Features
- 🔐 **User Authentication** – Register & sign in securely  
- 🧠 **AI Face Detection** – Powered by the Clarifai API  
- 📸 **Image Upload or URL Input** – Detect faces from any image source  
- 🔄 **User Progress Tracking** – Each successful detection updates your entry count  
- 💾 **Persistent Login** – Session saved via localStorage  
- 🎨 **Modern UI** – Built with React, TailwindCSS, and ShadCN components  

---

## 🛠️ Tech Stack
**Frontend:** React, Vite, TailwindCSS, ShadCN/UI  
**Backend:** Node.js, Express, Knex, PostgreSQL  
**AI Service:** Clarifai API  
**Deployment:** Render (Frontend & Backend)  

---

## 📦 For Developers (Optional Setup)
If you’d like to run it locally:

```bash
# Clone the repository
git clone https://github.com/ChrisMerinoDev/SmartBrain-FaceRecognition-App
cd FaceRecognitionApp

# Install dependencies
npm install 

# Add your environment variables
# .env
VITE_API_BASE_URL=http://localhost:3000
DATABASE_URL=your_postgres_connection_string
CLARIFAI_PAT=your_clarifai_api_key

# Start development server
npm run dev

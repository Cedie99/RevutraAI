# 📚 Revutra-AI

SmartReviewer-AI is a web-based application that empowers users with instant access to understanding by intelligently processing and summarizing the content of uploaded documents (.pdf or .docx). Whether for exam preparation, document comprehension, or quick reviews, Revutra transforms complex materials into concise, easy-to-digest summaries.

## Instructions 

create a project folder 

//open terminal and create Laravel on terminal.
- composer create-project Laravel/Laravel:^9.0 revutraai-backend

//run the laravel.
- cd revutraai-backend
- php artisan serve

//open new terminal and create react app.
- npx create-react-app revutraai-frontend

//run the react.
- cd revutraai-frontend
- npm install axios 
- npm install jspdf
- npm start

---

## 🚀 Features

- 📄 **File Upload**: Users can upload notes, slides, DOCXs or PDFs.
- 🧠 **AI-Powered Content Generation**: Automatically generates contents using GPT-4.1.
- 💬 **Smart Chatbot**: An interactive AI chatbot allows users to ask questions based on their uploaded content.
- 🧩 **Fullstack Architecture**: Seamless integration between Laravel APIs and React frontend.

---

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React   |
| Backend    | Laravel (PHP)               |
| AI Engine  | Azure OpenAI GPT-4.1        |
| Database   | MySQL / SQLite (Laravel default) |
| Auth       | Laravel Sanctum / Breeze (if used) |


# 📚 Revutra-AI

SmartReviewer-AI is a web-based application that empowers users with instant access to understanding by intelligently processing and summarizing the content of uploaded documents (.pdf or .docx). Whether for exam preparation, document comprehension, or quick reviews, Revutra transforms complex materials into concise, easy-to-digest summaries.

## Instructions 

1️⃣ Clone the repository.

- git clone https://github.com/Cedie99/Revutra-AI.git
- cd Revutra-AI
  
2️⃣ Setup the Frontend.

- cd revutraai-frontend
- npm install
- npm start

3️⃣ Setup the Backend.

- cd revutraai-backend
- php artisan serve

4️⃣ Environment Variables.

Create a .env file inside backend (and frontend if needed).

- AZURE_OPENAI_ENDPOINT=https://xxxxxxxx
- AZURE_OPENAI_API_KEY=xxxxx
- AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1
- AZURE_OPENAI_API_VERSION=2025-01-01-preview

- APP_ENV=production
- APP_DEBUG=false
- APP_URL=https://xxxxxxxx

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


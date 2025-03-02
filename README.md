# ShareLink - Private & Public Link Sharing System

## 🔗 Live Demo
[ShareLink - Live](https://sharelink-8fda4.web.app/)

## 📖 About the Project
ShareLink is a web-based system that allows users to upload files (images, PDFs) and text, generate shareable links, and manage access settings. Users can mark their links as **public** (accessible by anyone) or **private** (requiring authentication or a password). The platform includes:

- File Upload (Images, PDFs, Docs) 📂
- Text Sharing 📝
- Public & Private Link Management 🔒
- User Authentication (Firebase) 🔐
- Responsive UI 🎨

## 🚀 Technologies Used
- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (NoSQL)
- **Authentication:** Firebase
- **File Upload API:** ImgBB

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/AbirhossenCSE/Link-Sharing-System-Client
cd Link-Sharing-System-Client
```

### 2️⃣ Install Dependencies
#### Frontend Setup
```sh
npm install
```
#### Backend Setup
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a **.env** file in the root directories of **frontend** and **backend** with the required API keys.

#### Frontend (.env)
```
VITE_IMAGE_KEY=your_imgbb_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

#### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 4️⃣ Start the Development Server
#### Run Frontend
```sh
cd frontend
npm run dev
```
#### Run Backend
```sh
cd backend
npm start
```

### 5️⃣ Open in Browser
The app will run at:
```
http://localhost:5173/
```

## 📌 Features
- ✅ Upload and generate shareable links for images and PDF files.
- ✅ Save and share text via unique links.
- ✅ Firebase authentication (Google sign-in, email/password login).
- ✅ Private & public link management.
- ✅ Responsive UI with Tailwind CSS.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, create a feature branch, and submit a pull request.


---
💡 **Developed by [Abir Hossen](https://github.com/AbirhossenCSE/)** 🚀


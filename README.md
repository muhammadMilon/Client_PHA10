# 🎬 MovieMaster Pro — Client

**MovieMaster Pro** is a full-featured movie management web application where users can browse, manage, and organize their favorite movies with ease.
It features a sleek UI, dynamic data rendering, secure authentication, and personalized collections — all powered by a modern React-based frontend.

---

## 🌐 Live Site

🔗 **[Smesh Me](https://moviemaster-milon.web.app/)**

---

## 🧠 Overview

MovieMaster Pro provides a clean and responsive user interface for discovering and managing movies.
Users can register, log in, explore movie details, and maintain their own movie collection — all seamlessly connected with a secure backend API.

---

## ✨ Features

* 🎞️ **Dynamic Movie Listing** — Displays all movies from MongoDB via REST API
* 🧑‍💻 **User Authentication** — Secure login & registration with Firebase
* 💾 **My Collection** — Manage your own added movies
* 🧩 **CRUD Support** — Add, update, delete movies easily
* 🔒 **Protected Routes** — Restrict sensitive pages to logged-in users
* 🌗 **Dark / Light Theme Toggle** — Switch between themes for better UX
* 📱 **Fully Responsive** — Works flawlessly on mobile, tablet, and desktop
* 🎨 **Modern UI/UX** — Eye-catching cards, smooth animations, and clean layout

---

## ⚙️ Tech Stack

* **Frontend Framework:** React.js (Vite)
* **Routing:** React Router
* **Authentication:** Firebase Auth
* **Styling:** Tailwind CSS + DaisyUI
* **Notifications:** React Hot Toast
* **Deployment:** Netlify

---

## 🧩 Folder Structure

```
MovieMaster-Pro-Client/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── context/
│   ├── hooks/
│   ├── assets/
│   └── App.jsx
├── public/
│   └── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/muhammadMilon/Client_PHA10.git
   cd moviemaster-pro-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```env
   VITE_API_URL=https://moviemaster-pro-server.vercel.app
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open in browser → `http://localhost:5173`

---

## 🧾 Developer Info

**👨‍💻 Author:** Muhammad Milon
📧 **Email:** [mmilon82814@gmail.com](mailto:mmilon82814@gmail.com)
💻 **Backend Repo:** [MovieMaster Pro Server](https://github.com/muhammadMilon/Server_PHA10)
🚀 **Live API:** [https://moviemaster-pro-server.vercel.app](https://moviemaster-pro-server.vercel.app)

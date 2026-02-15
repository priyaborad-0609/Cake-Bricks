# 🎂 Cake Bricks

Cake Bricks is a full-featured web-based cake ordering and management system designed to provide a seamless experience for both customers and administrators. 

The platform allows users to explore a variety of cakes, manage their cart, and place orders, while administrators can efficiently manage products, users, and overall system operations through a dedicated dashboard.

The application is built with a modern full-stack architecture ensuring secure authentication, structured data management, and responsive user experience.

---

## 🚀 Tech Stack

### Frontend
- React.js 
- React Router DOM
- Axios
- Context API
- CSS 

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## 🔐 Authentication & Security

- Passwords are securely hashed using **bcrypt**
- JWT Token-based authentication
- Protected Routes
- Role-based access (Admin / User)

---

## 📂 Project Structure

```
cake-bricks/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── README.md
```

---

<h2>📸 Screenshots</h2> 

<img width="1470" height="831" alt="Screenshot 2026-02-16 at 4 08 39 AM" src="https://github.com/user-attachments/assets/6e8f1019-a14e-4414-b4af-05d5593ff235" />

---


## ⚙️ Backend Setup

### 1️⃣ Go to Backend Folder

```bash
cd backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create .env File

Create a `.env` file inside backend folder and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Start Backend Server

```bash
node server.js
```

Backend will run on:
```
http://localhost:5000
```

---

## 💻 Frontend Setup

### 1️⃣ Go to Frontend Folder

```bash
cd frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Frontend (Vite)

```bash
npm run dev
```

Frontend will run on:
```
http://localhost:5173
```

---

## 🌟 Features

### 👩‍🍳 User Features
- Signup / Login
- JWT Authentication
- Browse Cakes
- View Cake Details
- Add to Cart
- Place Orders

### 🛠️ Admin Features
- Admin Login
- Add New Cakes
- Edit Cakes
- Delete Cakes
- Manage Products

---

## 🔄 How It Works

1. User registers
2. Password is hashed using bcrypt
3. JWT token is generated on login
4. Token is stored and used for protected routes
5. Admin can manage cake data from dashboard

---

## 👩‍💻 Developed By

Priya  
Full Stack Developer  
React | Node.js | Express | MongoDB  

---



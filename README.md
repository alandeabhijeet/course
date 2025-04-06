# 🎓 Course Management Microservices App

This is a full-stack course management application built using **Node.js microservices architecture**, **MongoDB Atlas**, and **React.js with Tailwind CSS**.

---

## 🧱 Architecture Overview

The project is divided into **two microservices**:

1. **Auth Microservice** – Handles user authentication, course ownership, and course purchase.
2. **Course Microservice** – Manages course creation, listing, editing, and deletion.

Each microservice has its own responsibilities and communicates with a central database (MongoDB).

---

## 🖥️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (Authentication)

### Frontend
- React.js
- Tailwind CSS

---

## 📂 Project Structure

```
course/
│
├── backend/
│   ├── auth/            # Auth microservice
│   └── course/          # Course microservice
│
├── frontend/            # React + Tailwind frontend
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas URI

---

## ⚙️ Backend Setup

### 1. Clone the repo

```bash
git clone https://github.com/alandeabhijeet/course.git
cd course
```

### 2. Setup Auth Microservice

```bash
cd backend/auth
npm install
```

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm start
```

### 🔐 Auth Routes

Base path: `/api/auth`

```http
POST    /signup                    # Register new user
POST    /login                     # Login user
POST    /logout                   # Logout user (uses token blacklist)
GET     /checkowner               # Verify if user is course owner
GET     /checkbuyer               # Verify if user has purchased course
DELETE  /deleteowneridfromuser    # Remove course ownership
GET     /sendcoursebuyerid        # Send course IDs bought by user
GET     /sendcourseownerid        # Send course IDs owned by user
GET     /verify-token             # Check if token is valid
POST    /add-owner-course         # Add course to owner's list
POST    /add-buy-course           # Add course to buyer's list
```

---

### 3. Setup Course Microservice

```bash
cd ../course
npm install
```

Create a `.env` file:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
```

Start the server:

```bash
npm start
```

### 📚 Course Routes

Base path: `/api/courses`

```http
GET     /items                     # Get all courses
GET     /item/:id                  # Get single course by ID
POST    /item                      # Create course (requires auth)
PUT     /item/:id                  # Update course
DELETE  /item/:id                  # Delete course
GET     /items/buy                 # Get courses user has bought
GET     /items/owner               # Get courses user owns
```

---

## 🧾 MongoDB Models

### User

```js
{
  username: String,
  password: String,
  buy_course: [ObjectId],
  owner: [ObjectId],
  createdAt: Date
}
```

### Blacklisted Token

```js
{
  token: String,
  createdAt: Date (auto-expires in 24 hours)
}
```

### Course

```js
{
  title: String,
  details: String,
  category: String,
  available: Boolean,
  timestamps: true
}
```

---

## 🎨 Frontend Setup

```bash
cd ../../frontend
npm install
npm start
```

- Built using **React** + **Tailwind CSS**
- Connects to backend using REST API
- Make sure backend services are running before starting the frontend

---

# 📝 Social Media App (Node.js + Express + MongoDB)

A simple social media web application where users can:

- Register & Login
- Create posts
- Like / Unlike posts
- Edit & Delete posts
- View all their posts on profile page

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Template Engine | EJS |
| Styling | Tailwind CSS (CDN) |
| Auth | JWT + Cookies |
| Password Security | bcrypt |

---

## 📌 Features

### 🔐 Authentication
- Register new users
- Login using JWT stored in cookies
- Secure password hashing with bcrypt
- Middleware-based protected routes

### 🗒 Posts
- Users can create posts
- Posts linked with users via ObjectId
- Posts appear in reverse chronological order

### ❤️ Likes
- Toggle like/unlike on posts
- Like count display on UI

### 🔧 Edit & Delete
- Only the post owner can edit or delete their post
- Post deletion removes reference from the user document

---

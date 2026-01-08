# GMT 458 – Full Stack Web GIS Project

This repository contains the ongoing development of the **GMT 458 – Web GIS** course project.  
The project aims to build a **Full Stack Web GIS application** using modern web technologies and a NoSQL database.

---

## 👤 Student Information
- **Name:** Oktay Duman  
- **Student ID:** 2200674014  
- **Course:** GMT 458 – Web GIS  

---

## 🚀 Project Overview
This project is designed as a **Full Stack Web GIS system**.  
At the current stage, the backend infrastructure has been successfully established.

The application architecture follows a **client–server model**, where:
- The **backend** provides RESTful API services.
- The **database** handles spatial and non-spatial data using MongoDB.
- The **frontend** (to be developed) will interact with the backend for map-based operations.

---

## 🛠 Tech Stack (Current State)

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Community Edition)**
- **Mongoose**
- **dotenv**
- **cors**

### Tools
- Visual Studio Code  
- MongoDB Shell (mongosh)  
- Git & GitHub  

---

## 📁 Project Structure (Current)

web-gis-proje/
│
├── client/ # Frontend (to be developed)
│
├── server/
│ ├── config/
│ │ └── db.js # MongoDB connection configuration
│ ├── node_modules/
│ ├── .env # Environment variables
│ ├── package.json
│ ├── server.js # Express server entry point
│
└── README.md

yaml
Kodu kopyala

---

## ⚙️ Environment Configuration

The backend uses environment variables stored in a `.env` file:

PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/public_issue_gis
JWT_SECRET=supersecretkey

yaml
Kodu kopyala

---

## 🔌 Backend Setup & Status

### ✔ Express Server
- Express server successfully runs on **PORT 5001**
- Root endpoint test:

GET /
Response: "Web GIS Backend Çalışıyor 🚀"

yaml
Kodu kopyala

### ✔ MongoDB Connection
- MongoDB Community Edition installed via Homebrew
- Local MongoDB service is running
- Database connection established using **Mongoose**
- Successful connection confirmation logged in terminal

---

## 🧪 Initial Testing

- MongoDB tested using `mongosh`
- Sample document insertion and retrieval verified
- Server tested via browser and terminal

---

## 📌 Current Progress Summary

✅ Project repository initialized  
✅ Backend folder structure created  
✅ Express server configured and running  
✅ MongoDB installed and connected  
✅ Environment variables configured  
✅ Basic API test route implemented  

---

## 🔜 Next Steps (Planned)

- Define MongoDB schemas for spatial data
- Implement CRUD operations for geographic features
- Develop RESTful API endpoints
- Integrate frontend with Leaflet.js
- Implement authentication and user roles
- Deploy and document the full system

---

## 📅 Development Note
This README will be **updated incrementally** as the project progresses, in accordance with the course requirement of **multi-day Git commits**.

---
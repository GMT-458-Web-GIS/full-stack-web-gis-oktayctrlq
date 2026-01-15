# 🌍 GMT 458 – Advanced Full Stack Web GIS: Smart City Management Platform

This repository contains the complete development of a **Full Stack Web GIS application** designed for **urban issue reporting** and **spatial data management**.  
The system enables citizens to report location-based urban problems while providing administrators with a robust dashboard for spatial analysis and management.

---

## 👤 Student & Course Information

- **Name:** Oktay Duman  
- **Student ID:** 2200674014  
- **Course:** GMT 458 – Web GIS  

🔗 **Live Application:** http://13.48.248.53:5002  
📘 **API Documentation (Swagger):** http://13.48.248.53:5002/api-docs  

---

## 🚀 Project Architecture Overview

The project is built on a modern **three-tier architecture** designed for **scalability, security, and high spatial performance**.

### 1) Frontend (Client)

- **Interactive Mapping:** Powered by **Leaflet.js**, utilizing **CartoDB** and **OpenStreetMap** basemaps.  
- **Spatial Interaction:** Supports dual-mode location acquisition via:
  - **HTML5 Geolocation API**
  - **Map-click interactivity** for precision  
- **User Experience:** Modern **Glassmorphism UI**, **Plus Jakarta Sans** typography, real-time system stats, and a **Dark/Light mode** toggle.  
- **Performance:** **Marker Clustering** to handle dense spatial points efficiently.

### 2) Backend (API)

- **Runtime Environment:** **Node.js** with **Express.js**  
- **Security & Auth:** Secure authentication using **JWT (JSON Web Tokens)** with **Role-Based Access Control**  
- **API Standards:** RESTful API design + integrated **Swagger (OpenAPI)** documentation  
- **File Handling:** Image uploads for issue photos via **Multer**, served through a static Express directory

### 3) Spatial Database

- **Engine:** **PostgreSQL** with **PostGIS** extension  
- **Spatial Indexing:** Uses **GIST** indexing on geometry columns to enable fast spatial querying  
  - *(Course performance requirement: +25% query performance boost)*

---

## ⚙️ Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Leaflet.js |
| **Backend** | Node.js, Express.js, JWT, BCrypt, Multer (File Uploads) |
| **Database** | PostgreSQL, PostGIS (Geometry/Point types) |
| **Cloud/DevOps** | AWS EC2 (Ubuntu 22.04), PM2, Git/GitHub |

---

## 💾 Database Schema & Spatial Indexing

The system utilizes a relational schema optimized for geographic data.

```sql
-- Issues Table Schema
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    photo TEXT,
    geom GEOMETRY(Point, 4326),  -- WGS84 Spatial Column
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- R-Tree Based Spatial Index for Performance
CREATE INDEX issues_geom_idx ON issues USING GIST (geom);

🛡️ User Roles & Security (RBAC)

The system implements Role-Based Access Control (RBAC) to ensure privacy and data integrity:

Citizen (Vatandaş): Can register, login, and report issues. Visibility is restricted to their own reports for privacy.

Staff / Belediye: Authorized to view all reported issues across the city for analysis and action.

Admin: Full system control, including data cleanup and administrative actions.

📁 Directory Structure
web-gis-proje/
├── client/                 # Frontend assets
│   └── index.html          # Main Application Entry & GIS Logic
├── server/                 # Backend API
│   ├── db/                 # Postgres connection pool
│   ├── routes/             # Auth and Issue API routes
│   ├── uploads/            # Issue photo storage
│   ├── setup.js            # DB Initialization & GIST indexing
│   └── server.js           # Main Express server
├── .env                    # Secrets and DB credentials
└── README.md

🛠️ Installation & Deployment
✅ Local Setup

Clone

git clone https://github.com/yourusername/web-gis-proje.git


Install dependencies

npm install


Database config

Install PostgreSQL + PostGIS

Update your .env credentials

Initialize DB

node server/setup.js


Run

node server/server.js

☁️ AWS Deployment

The project is hosted on AWS EC2 (Ubuntu).
PM2 is used as the production process manager to ensure high uptime (target 99.9%).
Security groups allow traffic on port 5002.

📌 Requirements Check

✅ Spatial Database: Fully implemented with PostGIS

✅ Cloud Deployment: Live on AWS EC2

✅ Spatial Index: GIST indexing successfully applied

✅ Authentication: JWT-based secure login + role management

Developed by Oktay Duman for GMT 458 – Web GIS Final Project.
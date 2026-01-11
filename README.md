# GMT 458 – Full Stack Web GIS Project

This repository contains the final development of the **GMT 458 – Web GIS** course project.
The project is a **Full Stack Web GIS application** built using modern web technologies, a **Spatial Database (PostgreSQL/PostGIS)**, and hosted on **AWS Cloud**.

## 👤 Student Information

* **Name:** Oktay Duman
* **Student ID:** 2200674014
* **Course:** GMT 458 – Web GIS

---

## 🚀 Project Overview

This project is a complete "Urban Issue Reporting System" that allows citizens to report location-based issues (potholes, trash, lighting) and enables administrators to manage them.

**Key Architectural Decisions:**
* **API Development Strategy:** Instead of using pre-built servers like GeoServer, a custom **RESTful API** was developed using Node.js to handle spatial queries efficiently.
* **Cloud Deployment:** The project is hosted live on an **Amazon Web Services (AWS) EC2** instance for real-world accessibility.
* **Spatial Performance:** Utilizes **PostGIS** with **R-Tree Spatial Indexing** for fast geographic queries.

---

## 🗺️ Core Features & Requirements Met

### 1. Advanced Web GIS Capabilities
* ✅ **Interactive Map:** Built with Leaflet.js & OpenStreetMap.
* ✅ **Real-time Geolocation:** User position detection via HTML5 API.
* ✅ **Spatial Database:** Data stored in **PostgreSQL** with **PostGIS** extension (Geometry/Point types).
* ✅ **Spatial Indexing:** GIST (Generalized Search Tree) indexing implemented for performance.

### 2. User & System Management
* ✅ **Authentication System:** Secure Login & Registration using **JWT (JSON Web Tokens)**.
* ✅ **Role-Based Access Control (RBAC):**
    * **Citizen:** Can view and report issues.
    * **Staff/Admin:** Can manage and delete issues.
    * **Guest:** Read-only access.

### 3. CRUD Operations
* ✅ **Create:** Report new issues with location, description, and photos.
* ✅ **Read:** View all issues on the map with popup details.
* ✅ **Update/Delete:** Authorized users can manage records.

### 4. Cloud & Deployment
* ✅ **AWS Hosting:** Deployed on an Ubuntu Server via AWS EC2.
* ✅ **Process Management:** Application runs continuously using **PM2**.

---

## 🛠 Tech Stack

### Frontend
* HTML5, CSS3, JavaScript (ES6+)
* **Mapping Library:** Leaflet.js
* **Basemaps:** OpenStreetMap (OSM)

### Backend (API)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Security:** BCrypt (Password Hashing), JWT (Tokens), CORS

### Database
* **DBMS:** PostgreSQL
* **Spatial Extension:** PostGIS
* **Library:** `pg` (node-postgres)

### DevOps & Tools
* **Cloud:** Amazon Web Services (AWS EC2)
* **OS:** Ubuntu Linux
* **Version Control:** Git & GitHub
* **Process Manager:** PM2

---

## 📁 Project Structure

```bash
web-gis-proje/
│
├── client/
│   ├── index.html          # Main User Interface (Map + Forms)
│   ├── admin.html          # Admin Dashboard (Optional)
│   └── assets/             # CSS and Icons
│
├── server/
│   ├── db.js               # PostgreSQL Connection Pool
│   ├── setup.js            # Database & Table Initialization Script
│   ├── server.js           # Main Express App & API Routes
│   ├── uploads/            # Storage for issue photos
│   ├── .env                # Environment Variables (DB Creds, Secrets)
│   └── package.json        # Dependencies
│
└── README.md
⚙️ Database Schema (PostgreSQL)
The system uses a relational schema with spatial capabilities:

SQL

CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    contact VARCHAR(100),
    image_url TEXT,
    location GEOMETRY(Point, 4326),  -- Spatial Column
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Index for Performance
CREATE INDEX idx_issues_location ON issues USING GIST (location);
🔗 API Endpoints
Authentication
POST /api/auth/register - Register a new user

POST /api/auth/login - Login and receive JWT

Issue Management
GET /api/issues - Retrieve all spatial data (GeoJSON format)

POST /api/issues - Report a new issue (Supports Multipart/Form-Data)

DELETE /api/issues/:id - Delete an issue (Admin only)

🧪 Deployment & Live Testing
The project is currently deployed on AWS.

Server: AWS EC2 (t2.micro / Ubuntu)

Port: 5002 (Custom TCP Rule enabled in Security Groups)

Live Access: The application is accessible via the public IP provided in the submission details.

📌 Progress Summary
❌ Old Plan: MongoDB (Removed for better spatial support)

✅ Current Status: PostgreSQL + PostGIS (Completed)

✅ Status: AWS Deployment (Completed)

✅ Status: Authentication & Security (Completed)

Developed by Oktay Duman for GMT 458.
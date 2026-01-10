GMT 458 – Full Stack Web GIS Project

This repository contains the ongoing development of the GMT 458 – Web GIS course project.
The project aims to build a Full Stack Web GIS application using modern web technologies and a NoSQL database.

👤 Student Information

Name: Oktay Duman

Student ID: 2200674014

Course: GMT 458 – Web GIS

🚀 Project Overview

This project is designed as a Full Stack Web GIS system that allows users to report location-based issues through an interactive map interface.

The system follows a client–server architecture, where:

The frontend provides a map-based user interface for interaction.

The backend exposes RESTful API services.

The database stores spatial and non-spatial data using MongoDB (GeoJSON format).

At the current stage:

Backend and frontend are integrated.

Users can access the system from desktop and mobile browsers.

Location, description, and photo-based issue reporting is implemented.

🗺️ Core Features

Interactive map using Leaflet.js & OpenStreetMap

Real-time user location detection

Issue reporting with:

Title

Description

Geographic coordinates

Optional photo upload

Storage of spatial data in MongoDB (GeoJSON)

Display of existing issues on the map

Mobile access via Ngrok

🛠 Tech Stack
Frontend

HTML5

JavaScript

Leaflet.js

OpenStreetMap

HTML5 Geolocation API

Backend

Node.js

Express.js

MongoDB (Community Edition)

Mongoose

Multer (file uploads)

dotenv

cors

Tools

Visual Studio Code

MongoDB Shell (mongosh)

Git & GitHub

Ngrok

📁 Project Structure
web-gis-proje/
│
├── client/
│   └── index.html          # Frontend (Map + Form)
│
├── server/
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/
│   │   └── Issue.js        # MongoDB schema (GeoJSON)
│   ├── routes/
│   │   └── issues.js       # REST API routes
│   ├── uploads/            # Uploaded images
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Express server entry point
│
└── README.md

⚙️ Environment Configuration

The backend uses environment variables stored in a .env file:

PORT=5002
MONGO_URI=mongodb://127.0.0.1:27017/public_issue_gis

🔌 Backend Setup & Status
✔ Express Server

Express server runs successfully on PORT 5002

Root endpoint test:

GET /


Response:

Web GIS Backend Çalışıyor 🚀

✔ MongoDB Connection

MongoDB Community Edition installed

MongoDB service running locally

Connection established using Mongoose

Successful connection confirmed via terminal logs

🔗 API Endpoints
Get all issues
GET /api/issues

Create a new issue
POST /api/issues


Form-Data Parameters:

title (string, required)

description (string)

lat (number)

lng (number)

photo (file, optional)

🌍 Spatial Data Format

Issues are stored using GeoJSON Point geometry:

{
  "type": "Point",
  "coordinates": [longitude, latitude]
}

📱 Mobile Access (Ngrok)

The backend can be exposed to mobile devices using Ngrok:

ngrok http 5002


This enables:

Mobile location access

Camera usage for photo uploads

Real-time testing on physical devices

🧪 Testing & Verification

MongoDB tested via mongosh

API endpoints tested via browser and REST clients

Map rendering tested on desktop and mobile browsers

Location and photo selection verified

📌 Current Progress Summary

✅ GitHub repository initialized
✅ Backend structure completed
✅ Express server running
✅ MongoDB connected
✅ REST API implemented
✅ Frontend integrated with backend
✅ Leaflet map operational
✅ Mobile access via Ngrok

🔜 Planned Next Steps

Fix POST request error handling (upload/debug)

Improve frontend UI/UX

Add issue categories and filtering

Implement authentication & user roles

Add admin/management panel

Deployment to a public server

Final report & presentation preparation
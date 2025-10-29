🌍 Country Data API (Stage 2 BE Project)
🧠 Overview

This project is a Node.js + Express REST API that:

Fetches and caches country data and exchange rates

Calculates estimated GDP per country

Provides endpoints for filtering, sorting, and viewing country data

Generates a summary image showing total countries, top 5 GDPs, and last refresh timestamp

🚀 Features

POST /countries/refresh → Fetch countries + exchange rates, store in DB, and generate image

GET /countries → List all countries (with filtering & sorting)

GET /countries/:name → Get a single country by name

DELETE /countries/:name → Remove a country

GET /countries/image → Serve cached summary image

GET /status → Health check (DB + last refresh info)

⚙️ Tech Stack
Tool Purpose
Node.js Runtime environment
Express.js Web framework
MySQL Database
Sequelize ORM for MySQL
Axios For external API requests
dotenv Environment variable management
node-canvas (Optional) For image generation
🛠️ Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/<your-username>/stage2BE.git
cd stage2BE

2️⃣ Install dependencies
npm install

Core dependencies:

npm install express sequelize mysql2 axios dotenv

If using image generation:

npm install canvas

⚙️ Environment Variables

Create a .env file in your root directory with:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=countries_db

🧩 Database Setup

Make sure MySQL is installed and running.

Then create your database manually or via Sequelize sync (it will auto-create tables if missing):

CREATE DATABASE countries_db;

▶️ Run Locally

Start the server:

node server.js

You should see:

✅ Database connected and synced
🚀 Server running on port 5000

🧪 Test Endpoints

Use Postman, Thunder Client, or curl:

1️⃣ Refresh country data
POST /countries/refresh

2️⃣ Get all countries
GET /countries

3️⃣ Get country by name
GET /countries/Nigeria

4️⃣ Delete a country
DELETE /countries/Nigeria

5️⃣ View summary image
GET /countries/image

6️⃣ Check status
GET /status

🖼️ Example Summary Image (Generated)

✅ cache/summary.png (auto-created after refresh)

Total countries stored

Top 5 GDP countries

Timestamp of last refresh

📦 Folder Structure
stage2BE/
│
├── src/
│ ├── controllers/
│ │ └── countryController.js
│ ├── routes/
│ │ └── countryRoutes.js
│ ├── services/
│ │ └── countryService.js
│ └── models/
│ └── Country.js
│
├── cache/
│ └── summary.png
│
├── server.js
├── .env
├── package.json
└── README.md

🧑‍💻 Author

Rotimi Praise
Backend Developer — Fintech & API Development

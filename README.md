## AI face enrollment (Phase 1)

The independent FastAPI service in `ai-service/` enrolls a face from the voter
image already stored by Cloudinary. Set `AI_SERVICE_URL` in `server/.env` (see
`server/.env.example`), then start it separately:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

During voter registration, Express saves the voter image and voter record,
posts the Cloudinary image URL to the internal `POST /enroll` service, and stores the
returned template in the internal `FaceProfile` collection. Enrollment is
bounded by `AI_SERVICE_TIMEOUT_MS`; a failure is logged and registration still
succeeds with `faceEnrolled: false`. No public endpoint returns a FaceProfile
or its embedding.

<p align="center">
  <img src="/screenshots/banner2.png" alt="BharatBallot Banner" width="100%" />
</p>

<h1 align="center">🗳️ BharatBallot</h1>

<p align="center">
  Secure Digital Election Platform for Modern Democracy
</p>

<p align="center">
  Empowering Democracy Digitally 🇮🇳
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/Tejwardeep-Singh/E-ELECTION-RAWJET?style=for-the-badge" />
  <img src="https://img.shields.io/github/forks/Tejwardeep-Singh/E-ELECTION-RAWJET?style=for-the-badge" />
  <img src="https://img.shields.io/github/issues/Tejwardeep-Singh/E-ELECTION-RAWJET?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://adminrawjet.onrender.com/">🔗 Admin Portal</a> •
  <a href="https://voterrawjet.onrender.com/">🔗 Voter Portal</a>
</p>

---

# 📌 Overview

BharatBallot is a full-stack digital election platform built to provide a secure, transparent, and scalable online voting experience.

The system modernizes election workflows through secure authentication, real-time vote monitoring, and dedicated administrative controls while maintaining a clean and citizen-friendly user experience.

This project is inspired by modern civic-tech and government digital infrastructure platforms.

---

# ✨ Core Features

## 🧑‍💼 Admin Portal

* 🔐 Secure Admin Authentication
* ➕ Add & Manage Candidates
* ✏️ Update Candidate Information
* ❌ Remove Candidates
* 📊 Real-Time Election Monitoring
* 📈 Result Analytics Dashboard
* 🖼️ Candidate & Party Image Uploads

---

## 🧑‍🤝‍🧑 Voter Portal

* 📝 Voter Registration & Login
* 🗳️ Secure Vote Casting
* 🔒 One Person, One Vote System
* 👀 Candidate Information Access
* ✅ Vote Confirmation System

---

## 🔐 Security Features

* JWT-based Authentication
* Protected Routes & Access Control
* Duplicate Vote Prevention
* Secure Session Management
* Cloud-based Media Storage
* Input Validation & Verification

---

# 🛠️ Tech Stack

## 🚀 Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)

---

## ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)

---

## 🗄️ Database

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)

---

## ☁️ Cloud & Tools

![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge)
![Multer](https://img.shields.io/badge/Multer-FF6C37?style=for-the-badge)

---

# 📂 Project Structure

```bash
BharatBallot/
│
├── client/          # React Frontend
├── server/          # Backend & APIs
├── screenshots/     # UI Screenshots
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Tejwardeep-Singh/E-ELECTION-RAWJET.git

cd E-ELECTION-RAWJET
```

---

## 2️⃣ Backend Setup

```bash
cd server

npm install

npm start
```

---

## 3️⃣ Frontend Setup

```bash
cd client

npm install

npm start
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `server/` directory.

```env
MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# 📸 Screenshots

## 🏠 Home Page

<img src="/screenshots/home.png" width="100%"/>

---

## 📊 Admin Dashboard

<img src="/screenshots/admin.png" width="100%"/>

---

## 🗳️ Voting Interface

<img src="/screenshots/voter.png" width="100%"/>

---

# 🚀 Future Improvements

* 🔐 Aadhaar Verification Integration
* 📱 Mobile Application
* 🌐 HTTPS & Production Deployment
* 📡 Real-Time Socket Integration
* ⛓️ Blockchain-based Vote Verification
* 📊 Advanced Election Analytics
* 🧠 AI-Based Fraud Detection

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request 🚀

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 📢 Share it with others

---

# 👨‍💻 Author

### Tejwardeep Singh


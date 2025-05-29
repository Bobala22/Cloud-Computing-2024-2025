
# 🚗 Car Fleet Management System – Backend

## 📋 Description

This is the backend service for the Car Fleet Management System. The system is designed to help companies manage their vehicle fleets efficiently and sustainably. It includes features such as tracking car maintenance, monitoring real-time vehicle status, analyzing usage patterns, and generating optimization suggestions using machine learning.

The backend integrates several Google Cloud services and APIs to ensure scalability, real-time updates, and deep analytics.

---

## ⚙️ Technologies & Services Used

- **Node.js / Express**
- **Google Cloud Services**
  - App Engine
  - Cloud Firestore
  - Cloud Functions
  - BigQuery
- **Google APIs**
  - Google Maps Directions API
  - Firebase Cloud Messaging (FCM)
  - Vertex AI Prediction API
- **JWT for authentication**
- **RESTful API structure**

---

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/car-fleet-backend.git
cd car-fleet-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables

Create a `.env` file and add:

```env
PORT=5000
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_maps_key
```

### 4. Start the development server
```bash
npm run dev
```

### 5. Start the production server
```bash
npm start
```

---

## 📡 API Structure (Examples)

- `GET /api/cars` – List all cars  
- `POST /api/cars` – Add a new car  
- `PUT /api/cars/:id` – Update car info  
- `DELETE /api/cars/:id` – Delete a car  
- `GET /api/reports` – Generate analytics report  
- `POST /api/notifications` – Trigger push notifications  

---

## 👥 Authors & Contribution

- **Isache Bogdan**
- **Eliza-Teodora Doltu**
- **Andrei Sabin Popa**

We welcome contributions! Feel free to open issues and submit pull requests to enhance the backend.

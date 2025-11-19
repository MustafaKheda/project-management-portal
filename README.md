
# Project Management Portal – Setup Guide
## 📦 Tech Used
- **Backend:** NestJS, PostgreSQL, TypeORM, JWT
- **Frontend:** React (Vite), Tailwind CSS
- **Auth:** JWT + Axios Interceptors

---

## 🛠 Backend Setup (NestJS)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create `.env`
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=assignment

JWT_SECRET=your_secret_key
FRONTEND_URLS=http://localhost:5173
```

### 3. Start PostgreSQL
Make sure PostgreSQL is running locally.

### 4. Start Backend
```bash
npm run start:dev
```

Backend runs on:  
➡ **http://localhost:3000**

---

## 🌐 Frontend Setup (React + Vite)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create `.env`
```
VITE_BASEURL=http://localhost:3000
```

### 3. Start Frontend
```bash
npm run dev
```

Frontend runs on:  
➡ **http://localhost:5173**

---

## 🔐 Admin Account Rule
To create an **admin user**, your email **must start with**:

```
admin
```

Examples:
- admin@gmail.com
- admin.user@company.com

All other emails become **member** by default.

---

## 🏢 Default Company Creation
When the backend runs for the first time, it automatically creates:

```
Cloud Flex Pvt Ltd
```

You do **not** need to manually create any company.

---

## ✔ You're All Set!
Start backend → start frontend → login or register → dashboard appears.

For Detail Overview of the project checkout Overview.md file
# 🎉 End of Documentation

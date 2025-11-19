# 📘 Project Management Portal -- Full Stack Assignment

**Tech Stack:** NestJS • PostgreSQL • TypeORM • React + Vite • JWT Auth\
------------------------------------------------------------------------

# 🚀 Overview

This project is a **Project Management Portal** built for
the Cloud Flex assignment.\
It includes:

-   User authentication (Register + Login)
-   JWT-based session handling
-   Automatic company (client) creation
-   Automatic admin-role detection
-   Project CRUD
-   User assignment to projects
-   Pagination + Search
-   React UI (Vite + Tailwind)
-   NestJS backend with PostgreSQL + TypeORM

------------------------------------------------------------------------

# 📂 Features

## ✅ User Management

-   Register with email and password
-   Login via JWT
-   Password hashing using bcrypt
-   Auto-detect **admin emails**
    -   If email **starts with `"admin"`**, the user becomes **admin**

### Examples:

  Email                  Role
  ---------------------- --------
  admin@gmail.com        admin
  admin123@company.com   admin
  user@gmail.com         member

------------------------------------------------------------------------

## 🏢 Default Company Creation

On first boot: - Backend checks if the company table is empty\
- If empty → creates:

    Cloud Flex Pvt Ltd

This ensures the system always has 1 valid workspace.

------------------------------------------------------------------------

# 🛠 Tech Stack

### **Backend**

-   NestJS
-   TypeORM
-   PostgreSQL
-   JWT for authentication
-   Role-Based Access Control (RBAC)

### **Frontend**

-   React + Vite
-   Tailwind CSS
-   Axios with interceptors
-   Token-based auth
-   Protected routes
-   Pagination + Search + Modals

------------------------------------------------------------------------

# 📑 Database Schema Overview

### **Entities:**

-   **Client**
-   **User**
-   **Project**
-   **ProjectUser**

### **Relationships:**

-   One client → many users
-   One client → many projects
-   Many users ↔ many projects

------------------------------------------------------------------------

# 🔐 Role-Based Access Control (RBAC)

### Global Roles:

-   `admin`
-   `member`

### Project-Level Roles:

-   `owner`
-   `developer`
-   `viewer`

### Permissions Matrix

  Action           Allowed
  ---------------- ---------------------------------
  Create Project   admin, owner
  Edit Project     admin, owner
  Delete Project   admin, owner
  Assign Users     admin, owner
  View Project     logged-in users in same company

------------------------------------------------------------------------

# ⚙ Backend Setup (NestJS)

### 1. Install Dependencies

``` bash
cd backend
npm install
```

### 2. Create `.env`

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=yourpass
    DB_NAME=assignment

    JWT_SECRET=your_jwt_secret
    FRONTEND_URLS=http://localhost:5173

### 3. Database Auto-Creation

Backend automatically: - Connects to default DB - Checks if `assignment`
exists - Creates DB if missing

### 4. Start Server

    npm run start:dev

------------------------------------------------------------------------

# 🌐 Frontend Setup (Vite + React)

### 1. Install

``` bash
cd frontend
npm install
```

### 2. Create `.env`

    VITE_BASEURL=http://localhost:3000

### 3. Run

    npm run dev

------------------------------------------------------------------------

# 🔗 API Endpoints

## **Auth**

  Method   Endpoint               Description
  -------- ---------------------- ------------------
  POST     `/api/auth/register`   Register user
  POST     `/api/auth/login`      Login user
  GET      `/api/auth/me`         Get current user

## **Projects**

  Method   Endpoint              Description
  -------- --------------------- -------------------------------------
  GET      `/api/projects`       List projects (Pagination + Search)
  POST     `/api/projects`       Create project
  GET      `/api/projects/:id`   Get project details
  PUT      `/api/projects/:id`   Update project
  DELETE   `/api/projects/:id`   Delete project

## **Project Users**

  Method   Endpoint                            Description
  -------- ----------------------------------- -------------
  POST     `/api/projects/:id/users`           Assign user
  PUT      `/api/projects/:id/users/:userId`   Update role
  DELETE   `/api/projects/:id/users/:userId`   Remove user

------------------------------------------------------------------------

# 🖥 Frontend Features

## 🔐 Authentication
-   Validation
-   Enter key submission
-   Error messages
-   JWT storage

## 📊 Dashboard

-   Search projects
-   Pagination
-   Limit selector
-   Create project modal
-   Assigned users count

## 📁 Project Detail View

-   User roles visible
-   Assign/remove users
-   Edit and Delete Project
-   Only owners/admins can edit/delete project assign/remove user

------------------------------------------------------------------------

# 🛡 Axios Interceptor

Handles: - Authorization header - Auto-redirect to `/login` on 401 -
Token removal

------------------------------------------------------------------------

# 🏁 Summary

This project includes: - Complete full-stack implementation - Fully
functional API - Role-based system - Company-level segregation - Smooth
and modern UI

The project fulfills **100% of all required features** in the
assignment.

------------------------------------------------------------------------

# 🙌 Instructions for Admin Account

To create an admin: - Register using an email **starting with
`"admin"`**

Example:

    admin.mehul@gmail.com

This user will automatically be assigned the **admin role**.

------------------------------------------------------------------------

# 🎉 End of Documentation

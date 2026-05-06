# 🚀 TaskFlow - Premium Task Management System

**TaskFlow** is a modern, full-stack Task Management application designed for teams that need clear organization and role-based control. Built with **Next.js 16**, **Prisma**, and **PostgreSQL**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)

---

## ✨ Key Features

- 🔐 **Secure Authentication**: Built-in login and signup system using NextAuth.js.
- 👑 **Role-Based Access Control (RBAC)**: 
  - **Admins**: Create/Delete projects, assign tasks to any user, and view global stats.
  - **Members**: View assigned tasks and update status (To-Do, In Progress, Done).
- 🌓 **Dynamic Theme Switching**: Smooth transition between Light and Dark modes with persistent user preference (Stored in LocalStorage).
- 📊 **Smart Dashboard**: Personalized statistics (Tasks, Projects, Completion Rates) based on user roles.
- 📱 **Fully Responsive**: Optimized for Desktop, Tablet, and Mobile devices with a premium "Glassmorphism" UI.
- 🔄 **Real-time Feel**: Manual refresh functionality to keep task lists synced without full page reloads.
- 🔍 **Advanced Task Filtering**: Filter tasks by **Status** (To-Do, In Progress, Done) and **Priority** (High, Medium, Low) for better focus.
- 🔄 **Smart Sorting**: Instantly sort tasks by **Latest Created** or **Priority** (High → Low, Low → High) to manage urgency effectively.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Vanilla CSS
- **Backend**: Next.js API Routes, NextAuth.js (JWT Strategy)
- **Database**: PostgreSQL (Production) / SQLite (Local Development)
- **ORM**: Prisma
- **Icons**: Lucide React
- **Animations**: Custom CSS Keyframes for smooth transitions

---

## 🏃 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kajaltomer782-cpu/task_manager_system.git
cd taskflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_random_secret_string"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Migration
```bash
npx prisma migrate dev --name init
```

### 5. Run the application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Role Permissions

| Feature | Admin | Member |
| :--- | :---: | :---: |
| Create Project | ✅ | ❌ |
| Delete Project | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Assign Tasks | ✅ | ❌ |
| Delete Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| View Global Stats | ✅ | ❌ |

---

## 🌐 Deployment

This project is optimized for deployment on **Railway** or **Vercel**:
1. Connect your GitHub repository.
2. Set the environment variables in the dashboard.
3. Use `npx prisma generate && npx prisma migrate deploy && next build` as the build command.

---
## 👤 Author
Kajal Tomer  
B.Tech CSE (AI & ML)



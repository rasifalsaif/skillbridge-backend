# SkillBridge Backend

SkillBridge is a robust tutoring platform backend designed to connect students with expert tutors across various categories. It provides a comprehensive set of features for user management, booking sessions, managing availability, and administrative oversight.

## 🚀 Features

### 🔐 Authentication & Authorization
- **Secure Registration & Login:** User authentication using JWT (JSON Web Tokens) and password hashing with Bcrypt.
- **Role-Based Access Control (RBAC):** Distinct roles for **STUDENTS**, **TUTORS**, and **ADMINS**, ensuring secure access to relevant features.
- **Password Management:** Secure endpoint for users to change their passwords.

### 👤 User Management
- **Profiles:** Users can view and update their personal profiles.
- **Statistics:** Personalized statistics for users to track their activities.
- **Home Dashboard:** Publicly accessible statistics to showcase platform activity.

### 👨‍🏫 Tutor Profiles & Availability
- **Tutor Directory:** Browse and search for tutors with detailed profiles, bios, and hourly rates.
- **Profile Management:** Tutors can manage their professional bio, rates, and associated categories.
- **Smart Availability:** Tutors can create and manage specific time slots for student bookings.

### 📅 Booking System
- **Session Booking:** Students can book tutors for specific availability slots within chosen categories.
- **Status Tracking:** Comprehensive booking lifecycle management (Confirmed, Completed, Cancelled).
- **Conflict Prevention:** (Internal Logic) Ensures slots cannot be double-booked.

### ⭐ Reviews & Ratings
- **Student Feedback:** Students can provide ratings and written reviews for tutors they have booked.
- **Review Management:** Students have the ability to manage or remove their own reviews.

### 🛠️ Admin Panel
- **System Analytics:** Detailed overview of platform performance and growth.
- **User Moderation:** Admins can moderate the community by banning or unbanning users.
- **Category Management:** Full CRUD (Create, Read, Update, Delete) operations for subject categories.

---

## 🛠️ Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Validation:** [Zod](https://zod.dev/)
- **Security:** JWT, Bcrypt, CORS
- **Build Tools:** tsup, tsx

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rasifalsaif/skillbridge-backend
   cd skillbridge-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge"
   JWT_SECRET="your_jwt_secret_here"
   PORT=5000
   ```

4. **Database Migration:**
   ```bash
   npm run db:migrate
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 📑 API Modules

- `Auth`: `/api/auth/*`
- `Users`: `/api/user/*`, `/api/home/*`
- `Tutors`: `/api/tutors/*`, `/api/tutor/*`, `/api/categories/*`
- `Bookings`: `/api/bookings/*`
- `Reviews`: `/api/review/*`
- `Admin`: `/api/admin/*`

---

## 📜 License
This project is licensed under the ISC License.

# HireMe - Job Posting Platform Backend

A robust backend system for **HireMe**, a job portal where companies can post jobs and job seekers can apply by uploading their CVs and making a payment. This system is built with **TypeScript**, **Express.js**, and **MongoDB**, featuring role-based access control (RBAC).

## 🚀 Features

  * **Role-Based Authentication:** Secure JWT authentication for Admins, Employees (Recruiters), and Job Seekers.
  * **Job Management:** Recruiters can post, edit, and delete their own jobs. Admins have global access.
  * **Application System:** Job Seekers can apply for jobs by uploading a CV (PDF/DOCX).
  * **Mock Payment Integration:** Simulates a payment of **100 Taka** required to submit an application.
  * **File Upload:** Secure handling of resume uploads using `Multer`.
  * **Admin Dashboard:** APIs for viewing system stats, managing users, and monitoring all applications.
  * **Input Validation:** Strict data validation using **Zod** to ensure data integrity.

## 🛠 Tech Stack

  * **Language:** TypeScript
  * **Runtime:** Node.js
  * **Framework:** Express.js
  * **Database:** MongoDB (Mongoose ODM)
  * **Authentication:** JWT (JSON Web Tokens) & BcryptJS
  * **Validation:** Mongoose & Native Checks
  * **File Handling:** Multer
  * **Validation:** Zod

-----

## ⚙️ Installation & Setup

### 1\. Clone the repository

```bash
git clone https://github.com/Sani-Mohibur/hireme-api.git
cd hireme-api
```

### 2\. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Rename `.env.example` to `.env`:

```bash
cp .env.example .env
```

Or create a new `.env` file manually and add:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hireme
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

### 4\. Run the Server

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

-----

## 🌐 Live Demo

Check out the backend live demo deployed on Render:

[https://hireme-backend-t817.onrender.com/](https://hireme-backend-t817.onrender.com/)

---

## 📖 API Documentation

### 🟢 Authentication

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login and get JWT | Public |

***Note:** Pass `role` as "EMPLOYEE" or "JOB\_SEEKER" during registration.*

### 💼 Jobs

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Get all jobs | Public |
| `GET` | `/api/jobs/:id` | Get single job details | Public |
| `POST` | `/api/jobs` | Post a new job | **Employee** |
| `PUT` | `/api/jobs/:id` | Update a job | **Employee (Owner)** |
| `DELETE` | `/api/jobs/:id` | Delete a job | **Employee (Owner)** |

### 📄 Applications & Uploads

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId` | Apply (Upload CV + Pay 100tk) | **Job Seeker** |
| `GET` | `/api/applications/my-history` | View my application history | **Job Seeker** |
| `GET` | `/api/applications/job/:jobId` | View applicants for a specific job | **Employee** |
| `PATCH` | `/api/applications/:id/status` | Accept/Reject application | **Employee** |

***Note:** For uploading CV, send the file with the key `resume` in `multipart/form-data`.*

### 🛡 Admin Panel

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | View all registered users | **Admin** |
| `GET` | `/api/admin/jobs` | View all jobs (Filter: `?company=Name`) | **Admin** 
| `DELETE` | `/api/admin/users/:id` | Delete a user | **Admin** |
| `GET` | `/api/admin/stats` | View system counts (Users, Jobs, Applications) | **Admin** |
| `GET` | `/api/admin/applications` | View all applications (Filter: `?status=STATUS`) | **Admin** |

***Note:** For status filter, `STATUS` can only be `ACCEPTED`, `REJECTED`, or `PENDING`.*

-----

## 💳 Payment Flow (Mock)

Since real payment gateway integration requires verified merchant accounts, this system uses a **Mock Payment Implementation**:

1.  When a **Job Seeker** hits the apply endpoint (`POST /api/applications/:jobId`), the backend simulates a payment process.
2.  The system internally generates a **Transaction ID** (e.g., `TXN_1723456789_123`).
3.  It assigns a payment amount of **100 Taka** and marks the status as `PAID`.
4.  This payment record is embedded into the Application document in MongoDB.

-----

## 📂 Entity Relationship Diagram (ERD)

The system consists of three main entities: **USER**, **JOB**, and **APPLICATION**.  

- **USER**: Represents Admins, Employees (Recruiters), and Job Seekers.  
- **JOB**: Represents jobs posted by Employees (Recruiters).  
- **APPLICATION**: Represents job applications submitted by Job Seekers, including resume uploads and payment details.

### Relationships

- **USER → JOB**: One-to-Many (a Recruiter can post multiple jobs).  
- **USER → APPLICATION**: One-to-Many (a Job Seeker can submit multiple applications).  
- **JOB → APPLICATION**: One-to-Many (a job can receive multiple applications).

### ERD Image

<p align="center">
  <img src="docs/erd-dark.png" alt="ERD" width="400" height="800"/>
</p>

-----

## 🧪 Testing & API Documentation

You can verify all endpoints using the published Postman Documentation.

**🔗 [View Postman Documentation](https://documenter.getpostman.com/view/46560325/2sB3dQupTi)**

### How to Test Locally
1.  Ensure the server is running (`npm run dev`).
2.  Open the Postman link above.
3.  **Register** users with different roles (`ADMIN`, `EMPLOYEE`, `JOB_SEEKER`) to test the specific permissions for each route.
   
***Note:** When testing the **Apply for Job** endpoint as a **Job Seeker**, the system will automatically simulate a successful payment and generate a transaction ID.*

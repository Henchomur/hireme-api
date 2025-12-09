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
git clone https://github.com/Sani-Mohibur/hireme-backend.git
cd hireme-backend
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Configure Environment Variables

Rename `.env.example` to `.env` or create a new one:

```bash
cp .env.example .env
```


### 4\. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hireme
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

### 5\. Run the Server

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`.

-----

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

*(Place your ERD image in the repo and link it here, or use the description below)*

  * **Users** have roles (Admin, Employee, Job Seeker).
  * **Employees** create **Jobs** (One-to-Many).
  * **Job Seekers** create **Applications** linked to **Jobs** (Many-to-Many via Application entity).

-----

## 🧪 Testing

You can import the provided Postman Collection (if available) or test using the endpoints above.

**Test Users (Create these via Register endpoint first):**

1.  **Admin:** `admin@example.com` (Role: ADMIN)
2.  **Recruiter:** `recruiter@company.com` (Role: EMPLOYEE)
3.  **Seeker:** `seeker@email.com` (Role: JOB\_SEEKER)

-----

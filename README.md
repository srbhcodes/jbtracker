# Job Portal - Employer Side

Full-stack assignment project for employer-side job management.

## Tech Stack

- Frontend: React (Vite), React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose

## Features

- View list of jobs
- View single job details
- Create job posting
- Edit existing job posting
- Delete job posting
- Loading/error/empty states on key screens

## Project Structure

```txt
Job/
  backend/
  frontend/
  task.txt
```

## Setup Instructions

### 1) Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Make sure MongoDB is running and your `MONGO_URI` in `.env` is valid.

### 2) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on Vite and proxies `/api` requests to `http://localhost:5000`.

## API Endpoints

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

## Notes

- Authentication is not implemented (optional bonus in assignment).
- UI is clean and responsive, and can be adjusted to match final Figma details once the design file link is available.

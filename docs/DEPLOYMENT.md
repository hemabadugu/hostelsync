# HostelSync — Production Deployment Guide & Checklist

## Overview
This document covers the end-to-end production deployment strategy for **HostelSync**:
- **Frontend (React)**: Deployed on **Vercel**
- **Backend (Express + Socket.io)**: Deployed on **Render**
- **Database (MongoDB)**: Deployed on **MongoDB Atlas**
- **Media Assets (Avatars & Inspection Photos)**: Hosted on **Cloudinary**
- **AI Agent Orchestration Service**: Deployed on **Antigravity Service Runtime**

---

## Deployment Architecture Diagram

```
                              ┌────────────────────────┐
                              │     Vercel Edge CDN    │
                              │ (HostelSync Frontend)  │
                              └───────────┬────────────┘
                                          │
                         HTTPS REST / WSS WebSocket
                                          │
                                          ▼
┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│     Cloudinary CDN     │◀───│   Render Web Service   │───▶│     MongoDB Atlas      │
│  (Media & Inspection)  │    │ (Express + Socket.io)  │    │  (Managed Database)    │
└────────────────────────┘    └───────────┬────────────┘    └────────────────────────┘
                                          │
                                   Internal AI Call
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │  Antigravity Service   │
                              │  (Python AI Agents)    │
                              └────────────────────────┘
```

---

## Step 1: Database Setup (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (e.g. `hostelsync-admin`).
3. Under **Network Access**, add `0.0.0.0/0` or Render outbound IP ranges.
4. Copy your Connection String (`mongodb+srv://...`) into `MONGO_URI`.

---

## Step 2: Backend Web Service Deployment (Render)

1. Connect your repository to [Render.com](https://render.com).
2. Create a **Web Service** with:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
3. Configure Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Generate strong 64-char secret>`
   - `CLIENT_URL`: `https://hostelsync.vercel.app`
   - `RAZORPAY_KEY_ID`: `<Razorpay Live Key ID>`
   - `RAZORPAY_KEY_SECRET`: `<Razorpay Live Secret>`
   - `CLOUDINARY_CLOUD_NAME`: `<Cloudinary Cloud Name>`

---

## Step 3: Frontend Client Deployment (Vercel)

1. Import your project into [Vercel](https://vercel.com).
2. Set **Framework Preset**: `Vite`.
3. Set **Root Directory**: `client`.
4. Build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set Environment Variables:
   - `VITE_API_URL`: `https://hostelsync-backend.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID`: `<Razorpay Live Key ID>`

---

## Step 4: AI Orchestration Layer Deployment (Antigravity Service)

1. Ensure `ai/requirements.txt` dependencies are installed:
   ```bash
   pip install -r ai/requirements.txt
   ```
2. Start the python orchestrator entrypoint:
   ```bash
   python ai/orchestrator.py
   ```

---

## Pre-Flight Deployment Checklist

- [x] React build output passes cleanly (`dist/` directory generated with 0 bundler errors).
- [x] CORS configured for `CLIENT_URL` domain.
- [x] Socket.io WebSocket CORS origin set to production client URL.
- [x] JWT token expiration set to secure 30-day window.
- [x] MongoDB Atlas indexes enabled on `User.email`, `Room.roomNumber`, `Complaint.ticketId`, `LeaveRequest.leaveId`, `Payment.paymentId`, `Visitor.visitorId`.
- [x] Razorpay HMAC-SHA256 signature verification enabled.
- [x] Environment variable fallback defaults configured safely.

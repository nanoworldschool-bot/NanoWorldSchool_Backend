import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import dns from 'dns';
import mongoose from 'mongoose';
import os from 'os';

// Use Google DNS for resolving MongoDB SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

import connectDB from './config/db.js';

import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import setupRoutes from './routes/setupRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();




// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Root route for Server Status
app.get('/', (req, res) => {
  const status = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    node: process.version,
    platform: process.platform,
    env: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected',
    timestamp: new Date().toISOString(),
    cpu: os.loadavg(),
  };

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
  };

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Status | NanoWorldSchool</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg: #030712;
          --card: #111827;
          --primary: #38bdf8;
          --text: #f3f4f6;
          --text-muted: #9ca3af;
          --border: #1f2937;
          --success: #10b981;
          --warning: #f59e0b;
        }
        body {
          font-family: 'Outfit', sans-serif;
          background-color: var(--bg);
          color: var(--text);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          overflow: hidden;
        }
        .bg-glow {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%);
          filter: blur(50px);
          z-index: -1;
        }
        .container {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 40px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
          backdrop-filter: blur(10px);
        }
        h1 {
          margin: 0 0 30px 0;
          font-size: 24px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--primary);
        }
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${status.database === 'Connected' ? 'var(--success)' : 'var(--warning)'};
          box-shadow: 0 0 15px ${status.database === 'Connected' ? 'var(--success)' : 'var(--warning)'};
          display: inline-block;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border);
        }
        .stat-row:last-child {
          border-bottom: none;
        }
        .label {
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 400;
        }
        .value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: var(--text);
        }
        .badge {
          background: rgba(56, 189, 248, 0.1);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="bg-glow"></div>
      <div class="container">
        <h1><span class="indicator"></span> Backend Operational</h1>
        <div class="stats">
          <div class="stat-row">
            <span class="label">Status</span>
            <span class="badge">Running</span>
          </div>
          <div class="stat-row">
            <span class="label">Uptime</span>
            <span class="value">${formatUptime(status.uptime)}</span>
          </div>
          <div class="stat-row">
            <span class="label">Memory Usage</span>
            <span class="value">${(status.memory.rss / 1024 / 1024).toFixed(1)} MB</span>
          </div>
          <div class="stat-row">
            <span class="label">Node Engine</span>
            <span class="value">${status.node}</span>
          </div>
          <div class="stat-row">
            <span class="label">Environment</span>
            <span class="value" style="text-transform: capitalize;">${status.env}</span>
          </div>
          <div class="stat-row">
            <span class="label">Database</span>
            <span class="value" style="color: ${status.database === 'Connected' ? 'var(--success)' : 'var(--warning)'};">
              ${status.database}
            </span>
          </div>
        </div>
        <div class="footer">
          Last Check: ${new Date().toLocaleTimeString()}
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;




if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend Server running in MVC mode on port ${PORT}`);
  });
}

export default app;

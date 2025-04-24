const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Redis = require('redis');
const connectRedis = require('connect-redis');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth-routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Redis setup for session store
const RedisStore = connectRedis(session);
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  legacyMode: true
});

redisClient.connect().catch(console.error);
// Middleware
app.use(cors({
    origin: [process.env.CLIENT_DOMAIN, 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Routes
  app.use('/api/auth', authRoutes);
  
  // Start server
  app.listen(PORT, () => {
    console.log(`SSO Server running on port ${PORT}`);
  });
  
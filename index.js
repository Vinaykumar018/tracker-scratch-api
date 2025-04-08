const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ This line was missing
const connectDB = require('./config/db');
const routes = require('./routes/routes');

dotenv.config(); // Load environment variables

const app = express();

// Apply CORS middleware
app.use(cors({
  origin: "*",
}));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API Routes
app.use("/api", routes);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

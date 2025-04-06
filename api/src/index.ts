import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import bookRoutes from "./routes/book.routes";
import { errorHandler, routeMiddleware } from './middleware';
// import { clientUse } from 'valid-ip-scope';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
    credentials:true,
    origin:["http://localhost:5173"]//change according your client url
}));


// 🔧 Increase payload size limit to support large JSON or file uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Route Middleware
// app.use(clientUse());
app.use(routeMiddleware);

// Test Route
app.use("/hello", (_req, res) => {
  res.send("Hello World");
});

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/books", bookRoutes);


// Error handling
app.use(errorHandler);
console.log("process.env", process.env.MONGODB_URI)
// Database connection
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

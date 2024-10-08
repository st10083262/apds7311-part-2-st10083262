const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const https = require('https');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const app = express();

// MongoDB User Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: 'https://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentialss

}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Regex Patterns for Validation
const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // 3-15 characters, letters, numbers, underscores
const idNumberRegex = /^\d{13}$/; // Exactly 13 digits
const accountNumberRegex = /^\d{10,16}$/; // Between 10 to 16 digits
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character

// Registration Route
app.post('/user/register', async (req, res) => {
  const { username, password, idNumber, accountNumber } = req.body;

  // Validate input fields
  if (!username || !password || !idNumber || !accountNumber) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Invalid username format. Use 3-15 characters, letters, numbers, or underscores.' });
  }
  if (!idNumberRegex.test(idNumber)) {
    return res.status(400).json({ message: 'ID Number must be 13 digits' });
  }
  if (!accountNumberRegex.test(accountNumber)) {
    return res.status(400).json({ message: 'Account Number must be between 10 and 16 digits' });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = new User({ username, password: hashedPassword, idNumber, accountNumber });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET || 'jwt_secret_key', { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully!', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login Route
app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'jwt_secret_key', { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful!', token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// SSL Configuration
const sslOptions = {
  key: fs.readFileSync('certs/localhost-key.pem'),
  cert: fs.readFileSync('certs/localhost.pem'),
};

// HTTPS server
https.createServer(sslOptions, app).listen(5000, () => {
  console.log('Secure HTTPS server running on https://localhost:5000');
});

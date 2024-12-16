// Import Express.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure correct path
const app = express();
const path = require('path');
const PORT = 3000;

// Middleware to parse JSON and form data
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data

mongoose.connect('mongodb://127.0.0.1:27017/deshidwell')
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

// app.post('/api/users', async (req, res) => {
//   try {
//       const newUser = new User({
//           fullname: req.body.fullname,
//           username: req.body.username,
//           email: req.body.email,
//           num: req.body.num,
//           pass: req.body.pass,
//           gender: req.body.gender
//       });

//       await newUser.save();
//       res.status(201).json({ message: 'User created successfully!', data: newUser });
//   } catch (err) {
//       res.status(400).json({ error: err.message });
//   }
// });
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// Serve the any.html page at /any

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../../signup.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../login.html')); // Adjust the path
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html')); // Adjust the path
});
app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, '../../roombook.html')); // Adjust the path
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../AdminDash.html')); // Adjust the path
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../UserDash.html'));
});


app.use(express.static(path.join(__dirname, '../../')));
app.use('/resources', express.static(path.join(__dirname, '../../resources')));

// Sign Up ffrom here
app.post('/api/users', async (req, res) => {
  try {
      const { fullname, username, email, num, pass, gender } = req.body; // Destructure required fields
      const newUser = new User({ fullname, username, email, num, pass, gender });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully!', data: newUser });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Login part from here
app.post('/login', async (req, res) => {
  try {
      const { username, pass } = req.body;

      // Verify user from MongoDB
      const user = await User.findOne({ username: username, pass: pass });

      if (user) {
          res.status(200).send(`Welcome back, ${user.fullname}!`);
      } else {
          res.status(401).send('Invalid username or password');
      }
  } catch (err) {
      res.status(500).send('An error occurred during login');
  }
});
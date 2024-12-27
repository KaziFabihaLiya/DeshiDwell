// Import Express.js
require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Property = require('./models/property');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Ensure correct path
const PORT = 3000;
const multer = require('multer');
const path = require('path');
const app = express();

const mongoUri = process.env.MONGO_URI;

// Verify if the environment variable is loaded
if (!mongoUri) {
    console.error('Mongo URI is undefined. Check your .env file.');
    process.exit(1); // Exit the application if MONGO_URI is not set
}

mongoose.connect(mongoUri, { })
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// MongoStore setup
const store = MongoStore.create({
    mongoUrl: mongoUri,
});



// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../resources/uploads')); // Adjust path as necessary // Save files in 'resources/uploads'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Middleware to parse JSON and form data
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data


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
app.get('/test-firebase', async (req, res) => {
  const message = "Firebase is successfully integrated!";
  res.send(message);
});
app.get('/reservation', (req, res) => {
    res.sendFile(path.join(__dirname, '../../MakeReservation.html')); // Adjust the path if needed
});

app.use(express.static(path.join(__dirname, '../../')));

app.use('/resources', express.static(path.join(__dirname, '../../resources')));

// Sign Up ffrom here
// app.post('/api/users', async (req, res) => {
//   try {
//       const { fullname, username, email, num, pass, gender } = req.body; // Destructure required fields
//       const newUser = new User({ fullname, username, email, num, pass, gender });
//       await newUser.save();
//       res.status(201).json({ message: 'User created successfully!', data: newUser });
//   } catch (err) {
//       res.status(400).json({ error: err.message });
//   }
// });
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// Session Configuration
app.use(
  session({
      secret: 'your_secret_key', // Replace with a strong secret
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      cookie: { maxAge: 30 * 60 * 1000 }, // 30 Minutes er session
  })
);

app.post('/api/properties', upload.single('image'), async (req, res) => {
  console.log('Received data:', req.body); // Log the received data
  console.log('Uploaded file:', req.file); // Log the uploaded file

  try {
      const { name, price, description } = req.body;
      const imagePath = `/resources/uploads/${req.file.filename}`; // Get the uploaded image path

      const newProperty = new Property({
          name,
          price,
          description,
          image: imagePath,
      });

      await newProperty.save(); // Save the property to the database
      res.status(201).json({ message: 'Property added successfully!', data: newProperty });
  } catch (err) {
      console.error('Error saving property:', err); // Log the error for debugging
      res.status(500).json({ error: 'Failed to add property' });
  }
});
// API route to fetch all properties
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find({}, 'name latitude longitude description price'); // Select specific fields
        res.json(properties);
    } catch (err) {
        console.error('Failed to fetch properties:', err);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});


//firebase endpoint 
const admin = require('firebase-admin');

const serviceAccount = require('./firebase/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.post('/api/firebase-login', async (req, res) => {
    const { uid, email, displayName, photoURL } = req.body;
    try {
        // Find or create a user in MongoDB
        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({
                uid,
                email,
                displayName,
                photoURL,
            });
            await user.save();
        }
        // Create a session
        req.session.user = {
            id: user._id,
            displayName: user.displayName,
            email: user.email,
        };
        res.status(200).json({ message: "User logged in successfully!" });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post('/signup', async (req, res) => {
  try {
      const { fullname, username, email, num, pass, confpass, gender } = req.body;

      // Validate passwords match
      if (pass !== confpass) {
          return res.status(400).json({ error: 'Passwords do not match' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(pass, 10);

      // Create a new user
      const newUser = new User({
          fullname,
          username,
          email,
          num,
          pass: hashedPassword,
          gender,
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully!' });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});
app.post('/login', async (req, res) => {
    try {
        const { username, pass } = req.body;

        // Find user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Store user info in session
        req.session.user = {
            id: user._id,
            fullname: user.fullname,
            username: user.username,
        };

        // Return success response
        res.status(200).json({ message: 'Login successful!' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// Protected Dashboard Route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login');
  }

  res.sendFile(path.join(__dirname, '../../UserDash.html'), {
      headers: {
          'Cache-Control': 'no-store',
      },
  });
});

app.get('/api/user', (req, res) => {
    // Check if the user session exists
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized: User not logged in' });
    }

    // Return the user's data from the session
    const user = req.session.user;
    res.status(200).json({ fullname: user.fullname, email: user.username });
});
// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
  });
});
app.get('/api/session', (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(req.session.user);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





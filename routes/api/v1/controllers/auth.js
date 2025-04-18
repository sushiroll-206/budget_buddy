import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
var router = express.Router();

// Register a new user with email/password
router.post('/register', async function(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await req.models.User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Generate a username from email (or use a UUID if needed)
    const username = email.split('@')[0] || uuidv4();
    
    // Create new user
    const newUser = new req.models.User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      authType: 'email'
    });
    
    await newUser.save();
    
    // Set session
    req.session.isAuthenticated = true;
    req.session.account = {
      name: `${firstName} ${lastName}`,
      username: username
    };
    
    res.json({ 
      status: 'success',
      user: {
        name: `${firstName} ${lastName}`,
        username: username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login with email/password
router.post('/login', async function(req, res) {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await req.models.User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check if user is using email/password authentication
    if (user.authType !== 'email') {
      return res.status(401).json({ error: 'This account uses UW NetID authentication' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Set session
    req.session.isAuthenticated = true;
    req.session.account = {
      name: `${user.firstName} ${user.lastName}`,
      username: user.username
    };
    
    res.json({ 
      status: 'success',
      user: {
        name: `${user.firstName} ${user.lastName}`,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get login options
router.get('/options', function(req, res) {
  res.json({
    options: [
      { id: 'uw', name: 'UW NetID', description: 'Login with your UW NetID' },
      { id: 'email', name: 'Email/Password', description: 'Login with your email and password' }
    ]
  });
});

export default router; 
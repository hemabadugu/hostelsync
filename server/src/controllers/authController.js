const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new User
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, hostelBlock, roomNumber, department, year } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'error', message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      hostelBlock: hostelBlock || 'Block B (Aryabhata)',
      roomNumber: roomNumber || 'B-204',
      department: department || 'Computer Science & Engg',
      year: year || 'Year 3'
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          hostelBlock: user.hostelBlock,
          roomNumber: user.roomNumber,
          department: user.department,
          year: user.year,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Authenticate User & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Optional role check validation if provided
    if (role && user.role !== role) {
      console.warn(`User ${user.email} logged in with role switch to ${role}`);
    }

    res.status(200).json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelBlock: user.hostelBlock,
        roomNumber: user.roomNumber,
        department: user.department,
        year: user.year,
        attendancePercentage: user.attendancePercentage,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};

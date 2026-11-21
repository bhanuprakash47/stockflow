const bcrypt = require('bcryptjs');
const { User, Organization } = require('../models');
const { generateToken } = require('../utils/token');

const register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password || req.body.passoword;
  const organizationName = req.body.organization || req.body.organizationName || req.body.organization_name;

  try {
    if (!email || !password || !organizationName) {
      return res.status(400).json({
        message: 'All fields are required: email, password, and organization',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({
        message: 'A user with this email already exists',
      });
    }

    const organization = await Organization.create({
      name: organizationName.trim(),
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      organizationId: organization.id,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      organizationId: organization.id,
    });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        organizationId: organization.id,
        organization: {
          id: organization.id,
          name: organization.name,
        },
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      message: 'Server error during registration',
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: { email: normalizedEmail },
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      organizationId: user.organizationId,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        organizationId: user.organizationId,
        organization: user.organization,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      message: 'Server error during login',
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
};

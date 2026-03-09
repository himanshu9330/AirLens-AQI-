const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = ({ id, role, email }) => {
    return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        console.log(`[AUTH] New user registered: ${email}`);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken({ id: user._id, role: user.role, email: user.email }),
        });
    } catch (error) {
        console.error(`[AUTH ERROR] Registration failed for ${email}:`, error.message);
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            console.log(`[AUTH] User logged in: ${email}`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken({ id: user._id, role: user.role, email: user.email }),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(`[AUTH ERROR] Login failed for ${email}:`, error.message);
        next(error);
    }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res, next) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId,
            });
        }

        console.log(`[AUTH] User authenticated via Google: ${email}`);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken({ id: user._id, role: user.role, email: user.email }),
        });
    } catch (error) {
        console.error(`[AUTH ERROR] Google login failed:`, error.message);
        next(error);
    }
};
const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

        if (email === adminEmail && password === adminPassword) {
            console.log(`[AUTH SUCCESS] Admin logged in: ${email}`);
            res.json({
                _id: 'admin_id_001',
                name: 'System Admin',
                email: adminEmail,
                role: 'admin',
                token: generateToken({ id: 'admin_id_001', role: 'admin', email: adminEmail }),
            });
        } else {
            console.warn(`[AUTH FAILED] Admin login attempt failed for ${email}`);
            console.log(`[DEBUG] Received: "${email}", Expected: "${adminEmail}"`);
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, googleLogin, adminLogin };

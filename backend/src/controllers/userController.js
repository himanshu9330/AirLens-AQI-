const User = require('../models/User');

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
const updateLocation = async (req, res, next) => {
    try {
        const { latitude, longitude, area } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.currentLocation = {
            latitude,
            longitude
        };

        if (area) {
            user.currentArea = area;
        }

        await user.save();

        res.json({
            message: 'Location updated successfully',
            currentLocation: user.currentLocation,
            currentArea: user.currentArea
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            currentArea: user.currentArea,
            createdAt: user.createdAt,
            preferences: user.preferences
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateLocation,
    getUserProfile
};

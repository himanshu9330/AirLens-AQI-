const { check, validationResult } = require('express-validator');

const validateWardData = [
    check('ward').not().isEmpty().withMessage('Ward is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

const validateAlert = [
    check('ward').not().isEmpty().withMessage('Ward is required'),
    check('level').isIn(['Low', 'Moderate', 'High', 'Severe']).withMessage('Invalid alert level'),
    check('message').not().isEmpty().withMessage('Message is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateWardData, validateAlert };

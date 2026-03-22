const path = require('path');
const fs = require('fs');
const { getLocationBounds, generateGrid } = require('../services/gridService');
const logger = require('../utils/logger');

const DATA_DIR = path.join(__dirname, '../../data');

/**
 * GET /api/grid?location=india
 *
 * Returns grid points for the given location.
 * If a cached JSON file exists, returns it.
 * Otherwise generates the grid, saves it, and returns it.
 */
const getOrCreateGrid = async (req, res) => {
    try {
        const rawLocation = req.query.location;

        if (!rawLocation || typeof rawLocation !== 'string') {
            return res.status(400).json({ error: 'Missing required query parameter: location' });
        }

        const location = rawLocation.toLowerCase().replace(/\s+/g, '');
        const filePath = path.join(DATA_DIR, `${location}.json`);

        // ── Check for existing cached file ──────────────────────────────
        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(raw);
                logger.info(`[GridController] Returning cached grid for "${location}" (${data.length} points)`);
                return res.json(data);
            } catch (readErr) {
                logger.warn(`[GridController] Corrupt cache file for "${location}", regenerating...`);
            }
        }

        // ── Get bounds for location ─────────────────────────────────────
        const bounds = getLocationBounds(location);
        if (!bounds) {
            return res.status(400).json({
                error: `Unknown location: "${rawLocation}". Supported: india, delhi, mumbai, bangalore, chennai, hyderabad, kolkata, pune, ahmedabad, jaipur, lucknow`,
            });
        }

        // ── Generate grid ───────────────────────────────────────────────
        const grid = generateGrid(bounds, location);

        // ── Persist to disk ─────────────────────────────────────────────
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(filePath, JSON.stringify(grid, null, 2), 'utf8');
        logger.info(`[GridController] Generated and saved grid for "${location}" (${grid.length} points)`);

        return res.json(grid);
    } catch (error) {
        logger.error(`[GridController] Error: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error while processing grid request' });
    }
};

module.exports = {
    getOrCreateGrid,
};

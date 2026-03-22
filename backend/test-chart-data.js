require('dotenv').config();
const { getDashboardChartData } = require('./src/controllers/adminController');

const req = {};
const res = {
    setHeader: () => {},
    json: (data) => console.log(JSON.stringify(data, null, 2)),
    status: () => ({ json: (d) => console.log(d) })
};
const next = (err) => console.error(err);

getDashboardChartData(req, res, next);

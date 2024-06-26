const express = require('express');
const Temperature = require("../_models/temperature.js");
const { verifyToken } = require("../authMiddleware.js");
const router = express.Router();

// GET request handler for fetching temperature data
router.get('/', verifyToken, async (req, res) => {
    try {
        const { dateFrom, dateTo, device } = req.query;
        let query = {};

        if (dateFrom && dateTo) {
            query.timestamp = {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            };
        } else if (device) {
            query._id = device;
        }

        console.log(query);
        const temps = await Temperature.find(query)
            .limit((dateFrom && dateTo) || device ? undefined : 20)
            .lean();
        console.log(temps);

        res.status(200).json({ temps });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

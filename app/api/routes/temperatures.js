const express = require('express')
const Temperature = require("../../../_models/temperature.js")
const router = express.Router()

//TODO: ADD Gateway Token verification for as a wrapper for all calls (Middleware possible)
// GET request handler for fetching temperature data
router.get('/', async (req, res) => {
    try {
        const { dateFrom, dateTo, device } = req.query;
        let query = {};

        if (dateFrom && dateTo) {
            query.timestamp = {
                $gte: new Date(dateFrom),
                $lte: new Date(dateTo)
            };
            const temps = await Temperature.find(query)
                .limit((dateFrom && dateTo) || device ? undefined : 20)
                .lean();
            res.status(200).json({ temps });

        } else if (device) {
            const temps = await Temperature.find({"payload.client_id":device});
            res.status(200).json({ temps });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router
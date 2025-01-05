const express = require('express');
const router = express.Router();
const openaiRoutes = require('./openaiRoutes');
const spotifyRoutes = require('./spotifyRoutes');



router.get('/', (req, res) => {
    res.send('API is working');
});

router.use('/recommend-genre', openaiRoutes);

router.use('/spotify', spotifyRoutes);



module.exports = router;
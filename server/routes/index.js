const express = require('express');
const router = express.Router();
const recommendSongRoutes = require('./recommendSongRoutes');
const spotifyRoutes = require('./spotifyRoutes');



router.get('/', (req, res) => {
    res.send('API is working');
});

router.use('/recommend-song', recommendSongRoutes);

router.use('/spotify', spotifyRoutes);



module.exports = router;
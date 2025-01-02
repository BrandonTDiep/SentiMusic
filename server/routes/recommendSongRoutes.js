const express = require("express");
const router = express.Router();
const recommendSongController = require("../controller/recommendSongController");

// POST /recommend-song
router.post('/', recommendSongController.getSongRecommendation)


module.exports = router;
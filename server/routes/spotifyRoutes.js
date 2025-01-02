const express = require("express");
const router = express.Router();
const spotifyController = require("../controller/spotifyController");

// POST /recommend-song
router.get('/login', spotifyController.getLogin)


module.exports = router;
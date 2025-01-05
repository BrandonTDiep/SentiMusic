const express = require("express");
const router = express.Router();
const spotifyController = require("../controller/spotifyController");

// GET /login
router.get('/login', spotifyController.getLogin)

// GET /callback
router.get('/callback', spotifyController.getCallback)


module.exports = router;
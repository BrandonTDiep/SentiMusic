const express = require("express");
const router = express.Router();
const openaiController = require("../controller/openaiController");

// POST /recommend-genre
router.post('/', openaiController.getGenres)


module.exports = router;
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const cors = require('cors')
const morgan = require('morgan');

dotenv.config();

// express app
const app = express();

// Enable CORS for client origin only
const corsOptions = {
    origin: ['http://localhost:3000'],
}
app.use(cors(corsOptions))

// middleware
app.use(express.json());

app.use(morgan('dev'));

// Render React as View
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Setup Routes For Which The Server Is Listening
const routes = require('./routes')
app.use('/api/', routes)


// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Server error", stack } = err;
    console.log(stack);
    res.status(status).json({ message });
});


// Server Running
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


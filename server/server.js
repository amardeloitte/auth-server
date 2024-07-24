const express = require('express');
const bp = require('body-parser');
const api = require("./api");
const cors = require("cors");

const PORT = 8000;

const APP = express();
APP.use(cors());
APP.use(bp.json());

APP.use("/api", api);

APP.get("/", (req, res) => {
    res.send("Hello Server!")
});

APP.listen(PORT, () => {
    console.log("Server running on localhost ", PORT);
});
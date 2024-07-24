const express = require("express");
const fs = require("fs");
const router = express.Router();
const bookListData = require("./book-list");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
    let userData = req.body;
    let isUserPresent = false;
    fs.readFile("./data.json", "utf-8", (err, data) => {
        let dataArr = [];
        if(err) {
            res.send("Error ", err);
            return;
        }
        if(data) {
            dataArr = JSON.parse(data);
            isUserPresent = dataArr?.some(dataObj => dataObj.email === userData.email);
        }
        if(isUserPresent) {
            res.send("User already exists!");
            return;
        }
        dataArr.push(userData);
        const content = JSON.stringify(dataArr);
        fs.writeFile("./data.json", content, (err) => {
            if(err) {
                res.send("Error: ", err);
                return;
            }
            let payload = {
                subject: userData.email
            }
            let token = jwt.sign(payload, "test");
            res.send({token});
        })
    });
});

router.post("/login", (req, res) => {
    const userData = req.body;
    fs.readFile("./data.json", "utf-8", (err, data) => {
        if(err) {
            res.send("Error: ", err);
            return;
        }
        if(!data) {
            res.send("User does not exist!");
            return;
        }
        const dataArr = JSON.parse(data);
        const isUserPresent = dataArr?.some(dataObj => dataObj.email === userData.email);
        if(!isUserPresent) {
            res.send("Email does not exist!");
            return;
        }
        const isCorrectPassword = dataArr?.some(dataObj => dataObj.password === userData.password);
        if(!isCorrectPassword) {
            res.send("Incorrect password!");
            return;
        }
        let payload = {
            subject: userData.email
        }
        let token = jwt.sign(payload, "test");
        res.send({token});
    });
});

router.get("/bookList", verifyToken, (req, res) => {
    const data = bookListData;
    res.json(data);
});

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        res.send("Unauthorized request!");
    }
    let token = req.headers.authorization.split(" ")[1];
    if(token === 'null') {
        res.send("Unauthorized request!");
    }
    let payload = jwt.verify(token, "test");
    if(!payload) {
        res.send("Unauthorized request!");
    }
    next();
}

module.exports = router;
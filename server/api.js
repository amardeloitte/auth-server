const express = require("express");
const fs = require("fs");
const router = express.Router();
const bookListData = require("./book-list");

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
            res.send("User data saved successfully!")
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
        res.send('User found!');
    });
});

router.get("/bookList", (req, res) => {
    const data = bookListData;
    res.json(data);
});

module.exports = router;
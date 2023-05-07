const router = require("express").Router();
const fs = require("fs");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../utils/isLoggedIn");
const credentials = require("../credentials.json");
const template = require('string-placeholder')


router.get("/", (req, res) => {
    const statistics = template(process.env.STATISTICS, {
        total: process.env.TOTAL,
        size: process.env.SIZE
    })

    if (!isLoggedIn(req)) return res.redirect("/login");
    res.render("dashboard", {
        name: process.env.APP_NAME,
        statistics: statistics,
        user: credentials.user,
    });
});

router.get("/changepassword", (req, res) => {
    if (!isLoggedIn(req)) return res.redirect("/login");
    res.render("changepassword", {
        name: process.env.APP_NAME,
        msg: null,
    });
});

router.post("/changepassword", (req, res) => {
    const currentPassword = req.body.current;
    const newPassword = req.body.new;

    bcrypt.compare(currentPassword, credentials.password, function (err, result) {
        if (!result)
            return res.status(401).render("changepassword", {
                name: process.env.NAME,
                msg: "Old password is incorrect.",
            });

        bcrypt.hash(newPassword, 10, function (err, hash) {
            credentials.password = hash;
            fs.writeFileSync(
                "./credentials.json",
                JSON.stringify(credentials, null, "\t")
            );
            res.redirect("/logout");
        });
    });
});

router.get("/changeuser", (req, res) => {
    if (!isLoggedIn(req)) return res.redirect("/login");
    res.render("changeuser", {
        name: process.env.NAME,
        user: credentials.user,
    });
});

router.post("/changeuser", (req, res) => {
    if (!isLoggedIn(req)) return res.redirect("/login");
    const newUser = req.body.newuser;

    if (!newUser) return res.send("Please specify the new user.");

    credentials.user = newUser;
    fs.writeFileSync(
        "./credentials.json",
        JSON.stringify(credentials, null, "\t")
    );

    res.redirect("/dashboard");
});

module.exports = router;

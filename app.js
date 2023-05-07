const express = require("express");
const upload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const random = require("./utils/generateString");
const updateCache = require("./utils/updateCache");
const credentials = require("./credentials.json");
const serverless = require('serverless-http');
const app = express();
const router = require('express').Router()
require("dotenv").config();

//if (!credentials.password || !credentials.password.startsWith('$2b$10$')) {
//  const randomPassword = random(16)
//  console.log(`password: ${randomPassword}`)
//  bcrypt.hash(randomPassword, 10, function (err, hash) {
//      if (err) return console.log(err)
//      credentials.password = hash
//      fs.writeFileSync('./credentials.json', JSON.stringify(credentials, null, "\t"))
//  });
//}

app.use(upload());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.disable("x-powered-by");

const indexRouter = require('./routes/index')
const uploadRouter = require('./routes/upload')
const viewRouter = require('./routes/view')
const loginRouter = require('./routes/login')
const dashboardRouter = require('./routes/dashboard');


app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/upload', uploadRouter)
// app.use('/', viewRouter)
app.use('/dashboard', dashboardRouter)

app.use(express.static(path.join(__dirname, "public")))

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`)
})


updateCache();

module.exports.handler = serverless(app);
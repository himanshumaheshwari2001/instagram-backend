const express = require("express");
const app =express();
const cookieParser = require("cookie-parser")

const errorMiddleware = require("./middlewares/error")


if (process.env.NODE_ENV !== "production") {
    require(`dotenv`).config({path:"backend/config/config.env"})
}

//using middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


//importing routes

const post = require("./routes/post")
const user = require("./routes/user")


//using routes

app.use("/api/v1",post)
app.use("/api/v1",user)



app.use(errorMiddleware);

module.exports = app;
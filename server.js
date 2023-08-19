const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./db/mongodb");
const { redisConnect } = require("./db/redis");
const { userRoute } = require("./routes/user.route");
const { taskRoute } = require("./routes/task.route");
const { doneTaskRoute } = require("./routes/doneTask.route");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user",userRoute);
app.use("/task",taskRoute);
app.use("/taskDone",doneTaskRoute);

app.get("/",(req,res)=>{
    res.status(200).send({
        isError:false,
        message:"this is base point"
    })
})

app.all("*", (req, res) => {
    res.status(404).send({
        "error": `404 ! Invalid URL Detected.`
    })
})

let port = process.env.port || 8080;

app.listen(port, async () => {
    await redisConnect
    await connection
    console.log(`server started at port ${port}`)
})


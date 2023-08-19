const jwt  = require('jsonwebtoken');
const { client } = require('../db/redis');
require("dotenv").config();

const userAuth = async(req,res,next)=>{
    try {
        let token = req.headers.authorization;
        let data = jwt.verify(token, process.env.tokenKey);
        let blackToken = await client.get(`${data.email}blackToken`);
        if(blackToken==token){
            res.status(400).send({
                isError: true,
                error: "you are logged out , please login first"
            })
        }
        else{
            req.body.userID = data.userID;
            next();
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
}

module.exports = {userAuth};
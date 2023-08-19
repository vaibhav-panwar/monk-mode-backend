const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { client } = require("../db/redis");
const { userAuth } = require("../middlewares/userAuth");

const userRoute = Router();

userRoute.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body;
        let check = await UserModel.findOne({ email });
        if (!check) {
            const hash = bcrypt.hashSync(password, Number(process.env.saltRounds));
            let user = new UserModel({ name, email, password: hash });
            await user.save();
            res.status(200).send({
                isError: false,
                message: "user registered successfully",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "user already exists"
            })
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

userRoute.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await UserModel.findOne({ email });
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                let token = jwt.sign({ userID: user._id, email: user.email }, process.env.tokenKey, { expiresIn: '2d' });
                res.status(200).send({
                    isError: false,
                    message: "login successfull",
                    token
                })
            }
            else {
                res.status(400).send({
                    isError: true,
                    error: "enter correct password"
                })
            }
        }
        else {
            res.status(400).send({
                isError: true,
                error: "user doesn't exist"
            })
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

userRoute.get("/logout",userAuth ,async (req, res) => {
    try {
        let token = req.headers.authorization;
        let data = jwt.verify(token, process.env.tokenKey);
        await client.set(`${data.email}blackToken`,token);
        res.status(200).send({
            isError:false,
            message:"user logged out successfully"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

module.exports = {userRoute};
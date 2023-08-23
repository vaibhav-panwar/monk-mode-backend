const { Router } = require('express');
const { DoneTaskModel } = require("../models/doneTask.model");
const { userAuth } = require('../middlewares/userAuth');
const mongoose = require('mongoose');

const doneTaskRoute = Router();

doneTaskRoute.use(userAuth);

doneTaskRoute.get("/get", async (req, res) => {
    try {
        let { userID } = req.body;
        let userIDAsObjectID = new mongoose.Types.ObjectId(userID)
        let data = await DoneTaskModel.aggregate([
            {
                $match: {
                    userID:userIDAsObjectID
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: "taskID",
                    foreignField: '_id',
                    as: "taskDetails"
                }
            },
            {
                $project: {
                    taskDetails: { taskName: 1, duration: 1 },
                    taskID:1,
                    userID:1,
                    date:1
                }
            }
        ])
        res.status(200).send({
            isError: false,
            data
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

doneTaskRoute.post("/create", async (req, res) => {
    try {
        let { userID, taskID, date } = req.body;
        let check = await DoneTaskModel.findOne({ userID, taskID, date });
        if (!check) {
            let doneTask = new DoneTaskModel({ userID, taskID, date });
            await doneTask.save();
            res.status(200).send({
                isError: false,
                message: "task done"
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "task already done"
            })
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

doneTaskRoute.delete("/reset", async (req, res) => {
    try {
        let { userID } = req.body;
        await DoneTaskModel.deleteMany({ userID });
        res.status(200).send({
            isError: false,
            message: "your monk mode progress has been reset"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

module.exports = { doneTaskRoute };
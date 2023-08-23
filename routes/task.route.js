const { Router } = require("express");
const { TaskModel } = require("../models/task.model");
const { userAuth } = require("../middlewares/userAuth");

const taskRoute = Router();

taskRoute.use(userAuth);

taskRoute.get("/get", async (req, res) => {
    try {
        let { userID } = req.body;
        let tasks = await TaskModel.find({ userID });
        res.status(200).send({
            isError: false,
            tasks
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

taskRoute.get("/get/:date", async (req, res) => {
    try {
        let date = req.params;
        let { userID } = req.body;
        let tasks = await TaskModel.find({ userID ,date});
        res.status(200).send({
            isError: false,
            tasks
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

taskRoute.post("/create", async (req, res) => {
    try {
        let { userID, taskName, duration } = req.body;
        let tasks = await TaskModel.find({ userID });
        if (tasks.length < 5) {
            let newTask = new TaskModel({ userID, taskName, duration });
            await newTask.save();
            res.status(200).send({
                isError: false,
                message: "task created successfully",
                task: newTask
            })
        }
        else {
            res.status(400).send({
                isError: true,
                true: "You have exceeded 5 task limit of Monk Mode ."
            })
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

taskRoute.patch("/update/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let taskuser = await TaskModel.findById(id);
        if (req.body.userID == taskuser.userID) {
            let task = await TaskModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).send({
                isError: false,
                message: "task updated successfully",
                updatedTask: task
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "you are not authorised to perform this action"
            })
        }

    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

taskRoute.delete("/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let taskuser = await TaskModel.findById(id);
        if (req.body.userID == taskuser.userID) {
            let task = await TaskModel.findByIdAndDelete(id, { new: true });
            res.status(200).send({
                isError: false,
                message: "task deleted successfully",
                deletedTask: task
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "you are not authorised to perform this action"
            })
        }

    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

module.exports = { taskRoute };
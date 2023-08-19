const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let taskSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "provide userID"]
    },
    taskName: {
        type: String,
        required: [true, "provide taskName"]
    },
    duration: {
        type: String,
        required: [true, "provide duration"]
    }
}, {
    versionKey: false,
    timestamps: true
})

let TaskModel = mongoose.model("task", taskSchema);

module.exports = { TaskModel }
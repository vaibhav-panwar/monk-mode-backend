const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let doneTaskSchema = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "provide userID"]
    },
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task',
        required: [true, "provide taskID"]
    },
    date: {
        type: Date,
        required: [true, "provide date"],
    }
}, {
    versionKey: false,
    timestamps: true
})

let DoneTaskModel = mongoose.model("doneTask", doneTaskSchema);

module.exports = { DoneTaskModel };
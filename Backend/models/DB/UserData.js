const mongoose = require('mongoose')

const userDataSchema = mongoose.Schema({
    employerId: {
        type: String
    },
    employeeId: {
        type: String
    },
    tasks: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Task'
    }]
})

const UserData = mongoose.model('UserData', userDataSchema)

module.exports = UserData
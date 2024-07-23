import mongoose from 'mongoose';
// Step 2: Create the schema
const taskSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    taskstatus: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: true
    }
});
// Step 3: Create the model
const TasksModel = mongoose.model('Task', taskSchema, 'tasks');
export default TasksModel;

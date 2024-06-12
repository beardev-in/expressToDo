import mongoose from "mongoose";

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
  userId : {
    type: String,
    required: true
  }
});


const TasksModel = new mongoose.model(
  "Task",
  taskSchema,
  "tasks"
);

export default TasksModel;

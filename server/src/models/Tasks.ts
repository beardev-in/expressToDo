import mongoose, { Document, Model, Schema } from 'mongoose';

// Step 1: Define the interface for the document
interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  taskname: string;
  deadline: Date;
  taskstatus: boolean;
  userId: string;
}

// Step 2: Create the schema
const taskSchema: Schema<ITask> = new mongoose.Schema({
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
const TasksModel: Model<ITask> = mongoose.model<ITask>('Task', taskSchema, 'tasks');

export default TasksModel;

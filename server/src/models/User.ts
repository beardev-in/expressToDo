import mongoose, { Document, Model, Schema } from 'mongoose';

// Step 2.1: Define the interface for the document
interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  email: string;
  password: string;
  age: string;
  avatar?: string;
  tasks: mongoose.Types.ObjectId[];
}

// Step 2.2: Create the schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

// Step 2.3: Create the model
const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema, 'users');

export default UserModel;

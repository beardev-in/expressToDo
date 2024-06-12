import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  avatar : {
    type: String
  },
  tasks: [String],
});

const UserModel = new mongoose.model(
  "user",
  userSchema,
  "users"
);

export default UserModel;

import mongoose from 'mongoose';
// Step 2.2: Create the schema
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
    avatar: {
        type: String
    },
    tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }]
});
// Step 2.3: Create the model
const UserModel = mongoose.model('User', userSchema, 'users');
export default UserModel;

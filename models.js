import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let models = {};

// Connect to MongoDB 
console.log("Connecting to MongoDB");
await mongoose.connect(process.env.MONGODB_URI);
console.log("Successfully connected to MongoDB");

// User Table
const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String, // For email/password authentication
    authType: { type: String, enum: ['uw', 'email'], default: 'email' }, // 'uw' for UW NetID, 'email' for email/password
    created_date: { type: Date, default: Date.now }
});
models.User = mongoose.model('User', userSchema);
console.log("User Schema Created");

// Posts Table (Likes)
const postSchema = new mongoose.Schema({
    description: String,
    username: String,
    likes: [String],
    created_date: Date
});
models.Post = mongoose.model('Post', postSchema);
console.log("Post Schema Created");

// Comment Table
const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created_date: Date
});
models.Comment = mongoose.model('Comment', commentSchema);
console.log("Comment Schema Created");


const projectedBudgetSchema = new mongoose.Schema({
    type: String, 
    category: String,
    amount: {type: Number, required: true},
    description: String,
    username: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created_date: Date
});
models.ProjectedBudget = mongoose.model('ProjectedBudget', projectedBudgetSchema);
console.log("Projected Budget Schema Created");

const actualBudgetSchema = new mongoose.Schema({
    type: String,
    category: String,
    amount: {type: Number, required: true},
    description: String,
    username: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created_date: Date
});
models.ActualBudget = mongoose.model('ActualBudget', actualBudgetSchema);
console.log("Actual Budget Schema Created");

console.log("Mongoose models created");

export default models;

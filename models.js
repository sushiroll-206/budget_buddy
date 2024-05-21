import mongoose from 'mongoose';

let models = {};

// Connect to MongoDB 
console.log("Connecting to MongoDB");
await mongoose.connect("mongodb+srv://sohsht:password!@atlascluster.emrsee9.mongodb.net/budget_buddy");
console.log("Successfully connected to MongoDB");

// User Table
const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String
});
models.User = mongoose.model('User', userSchema);
console.log("User Schema Created");

// Posts Table (Likes)
const postSchema = new mongoose.Schema({
    userImage: String,
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
    amount: {type: Number, required: true},
    description: String,
    username: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});
models.ProjectedBudget = mongoose.model('ProjectedBudget', projectedBudgetSchema);
console.log("Projected Budget Schema Created");

const actualBudgetSchema = new mongoose.Schema({
    type: String, 
    amount: {type: Number, required: true},
    description: String,
    username: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});
models.ActualBudget = mongoose.model('ActualBudget', actualBudgetSchema);
console.log("Actual Budget Schema Created");

console.log("Mongoose models created");

export default models;

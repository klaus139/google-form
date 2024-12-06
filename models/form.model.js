// // import mongoose from 'mongoose';

// // const formSchema = new mongoose.Schema({
// //   title: { type: String, required: true },  // Title of the form
// //   description: { type: String },  // Optional description of the form

// //   // Array of references to the questions in the form
// //   questions: [
// //     {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: 'Question', // Reference to the Question model
// //     },
// //   ],

// //   creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User who created the form

// //   createdAt: { type: Date, default: Date.now }, // Timestamp for creation
// //   updatedAt: { type: Date, default: Date.now }, // Timestamp for updates
// // });

// // // Create and export the Form model
// // const Form = mongoose.model("Form", formSchema);

// // export default Form;

// import mongoose from 'mongoose';

// const optionSchema = new mongoose.Schema({
//   optionText: { type: String, required: true },
//   score: { type: Number, required: true },
//   feedback: { type: String },
// });

// const questionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   question: { type: String, required: true },
//   totalScore: { type: Number, required: true },
//   questionType: {
//     type: String,
//     enum: ['paragraph', 'multiple-choice'],
//     required: true,
//   },

//   options: [optionSchema],  // Only applicable for 'multiple-choice' questions
//   score: { type: Number, default: 0 },
//   feedback: { type: String },
//    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
//   creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const formSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   questions: [questionSchema],  // Embedded questions
//   status: {
//     type: String,
//     default: 'active',
//     enum: ['completed', 'closed', 'active']
// },
// formDeadline: {
//   type: Date
// },
//  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
//  creator:{type:String, ref:"User"},
//  submissions: [{
//   type: String,
//   ref: 'Submission',
// }],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const Form = mongoose.model('Form', formSchema);

// export default Form;

import mongoose from "mongoose";


const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
  formStatus: {
    type: String,
    default: 'active',
    enum: ['completed', 'closed', 'active']
},
  description:{type:String},
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Form = mongoose.model("Form", formSchema)

export default Form;


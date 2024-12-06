

import mongoose from 'mongoose';

// const optionSchema = new mongoose.Schema({
//   optionText: { type: String, required: true },  // Text for the option
//   score: { type: Number, required: true },  // Score for this option
//   feedback: { type: String },  // Optional feedback for this option
// });

// const questionSchema = new mongoose.Schema({
//   title: { type: String, required: true }, // Title of the question
//   question: { type: String, required: true }, // The question text
  
//   totalScore: { type: Number, required: true }, // The total score for the question
  
//   // Question type - 'paragraph' or 'multiple-choice'
//   questionType: {
//     type: String,
//     enum: ['paragraph', 'multiple-choice'],
//     required: true,
//   },
  
//   // Options for multiple-choice questions
//   options: [optionSchema],  // Array of options if it's a multiple-choice question
  
//   score: { type: Number, default: 0 },  // Score for a specific answer (e.g., user's choice)
//   feedback: { type: String },  // Feedback for the entire question
  
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User answering the question
//   creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', }, // User who created the question
  
//   createdAt: { type: Date, default: Date.now }, // Timestamp for creation
//   updatedAt: { type: Date, default: Date.now }, // Timestamp for updates
// });

// Create and export the Question model

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['paragraph', 'multipleChoice'],
    required: true
  },
  choices: [String],  // Only applicable if type is 'multipleChoice'
  estimatedScore: {
    type: Number,
    required: true
  },
  feedback: {
    type: String
  }
});
const Question = mongoose.model("Question", questionSchema);

export default Question;

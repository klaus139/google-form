import mongoose from "mongoose";
import Form from "../models/form.model.js";
import User from "../models/user.model.js";

export const createForm = async (req, res) => {
  try {
    // Destructure data from the request body
    const { title, description, questions } = req.body;

    // Validation
    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the creator's details from the logged-in user (creatorId is logged-in user's id)
    const creatorId = req.user.id;

    // Validate if creator exists (just to ensure it is valid)
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Validate each question and its options
    for (const question of questions) {
      const { title, questionText, totalScore, questionType, options } = question;

      // Ensure the question has required fields
      if (!title || !questionText || !totalScore || !questionType) {
        return res.status(400).json({ message: "Missing required fields in question" });
      }

      // Ensure questionType is valid
      if (!['paragraph', 'multiple-choice'].includes(questionType)) {
        return res.status(400).json({ message: "Invalid question type" });
      }

      // For multiple-choice, ensure options are provided
      if (questionType === 'multiple-choice' && (!options || options.length === 0)) {
        return res.status(400).json({ message: "Multiple-choice questions must have options" });
      }

      // If it's a multiple-choice question, ensure options are valid
      if (questionType === 'multiple-choice') {
        for (const option of options) {
          const { optionText, score } = option;
          if (!optionText || score === undefined) {
            return res.status(400).json({ message: "Each option must have optionText and score" });
          }
        }
      }

      // Add creatorId to each question (since all questions belong to the same creator)
      question.creatorId = creatorId;
    }

    // Create the form with the embedded questions and the creatorId
    const newForm = new Form({
      title,
      description,
      questions: questions.map(question => ({
        title: question.title,
        question: question.questionText,
        totalScore: question.totalScore,
        questionType: question.questionType,
        options: question.questionType === 'multiple-choice' ? question.options : [],
        score: 0,  // Default score
        feedback: question.feedback || '',
        creatorId,  // Assign creatorId to each question
      })),
      creatorId,  // This links the creator to the form as well
    });

    // Save the form to the database
    await newForm.save();

    res.status(201).json({ message: "Form created successfully", form: newForm });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

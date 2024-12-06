import Form from "../models/form.model.js";
import Question from "../models/question.model.js";
import Response from "../models/response.model.js";
import User from "../models/user.model.js";

export const createNewForm = async(req, res)=> {
    try {
        const { title, description, questions } = req.body;
        
        // Create questions
        const questionDocs = await Question.insertMany(questions);
        const creatorid = req.user.id;

        const creator = await User.findById(creatorid).select('-password');
if (!creator) {
    return res.status(400).json({
        message: "Creator not found"
    });
}

        
        // Create form
        const newForm = new Form({
          title,
          description,
          questions: questionDocs.map(q => q._id),
          creator:creator
        });
        
        await newForm.save();
        
        res.status(201).json({ message: 'Form created successfully', form: newForm });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating form' });
      }
}

export const submitFormResponse = async(req, res) => {
    try {
        const { formId, answers, userEmail } = req.body;
    
        // Find form and questions
        const form = await Form.findById(formId).populate('questions');
        if (!form) return res.status(404).json({ error: 'Form not found' });
    
        // Calculate score and save response
        let totalScore = 0;
        const answerDocs = answers.map((answer, idx) => {
          const question = form.questions[idx];
          const score = question.estimatedScore;
          totalScore += score;
          return {
            question: question._id,
            answer: answer.answer,
            score: score
          };
        });
    
        const newResponse = new Response({
          form: formId,
          answers: answerDocs,
          userEmail
        });
    
        await newResponse.save();
    
        // Send emails
        // sendEmail(userEmail, form, answers);
        // sendEmailToAdmin(form, answers);
    
        res.status(200).json({ message: 'Response submitted successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error submitting response' });
      }
}

export const getAllForms = async(req, res) => {
    try{
        const allForms = await Form.find()

        if(!allForms){
            return res.status(404).json({
                message:"No forms found"
            })
        }

        return res.status(200).json({
            allForms
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            error:"Error getting all forms"
        })
    }
}

export const getAllResponse = async(req, res) => {
 
        try {
          const responses = await Response.find()
            .populate('form')  // Populate the form details for each response
            .populate('answers.question')  // Populate question details for each answer
            .exec();
      
          if (responses.length === 0) {
            return res.status(404).json({
              message: 'No responses found'
            });
          }
      
          res.status(200).json({ responses });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error fetching responses' });
        }
    
}
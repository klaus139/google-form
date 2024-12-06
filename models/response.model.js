import mongoose,{Schema} from "mongoose"


const responseSchema = new mongoose.Schema({
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true
    },
    answers: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      answer: Schema.Types.Mixed,  // Stores the answer (could be a string or array for multiple choices)
      score: Number
    }],
    userEmail: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  });

  const Response = mongoose.model("Response", responseSchema);
  export default Response;
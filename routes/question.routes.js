import express from "express"
import { createForm } from "../controllers/question.controller.js";
import { authorizeAdmin, ensureAuthenticated } from "../middleware/authenticated.js";
import { createNewForm, getAllForms, getAllResponse, submitFormResponse } from "../controllers/form.controller.js";

const router = express.Router()

router.post("/create-form", ensureAuthenticated, authorizeAdmin, createNewForm)

router.post('/submit', ensureAuthenticated, submitFormResponse);

router.get("/all-forms", ensureAuthenticated, authorizeAdmin, getAllForms);

router.get('/all-response', ensureAuthenticated, authorizeAdmin, getAllResponse);


export default router;
import express from "express"
import { createUser, loginUser, verifyPasscode } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", createUser);
router.post('/login', loginUser);
router.post('/validate-passcode', verifyPasscode );

export default router;
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import appTokens from "../config/token.js";
import { generatePasscode } from "../utils/index.js";

export const createUser = async(req,res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(422).json({
                message:"please fill all the required fields"
            })
        }

        const oldUser = await User.findOne({email})
        

        if(oldUser){
            return res.status(409).json({
                message:"email already exists"
            })
        };

        const hashPassword = await bcrypt.hash(password, 10)
        const passcode = generatePasscode();

        const newUser = await User.create({
            name, email, password:hashPassword, passcode:passcode
            
        })

        return res.status(201).json({
            message:"user created successfully",
            id:newUser._id,
            passcode:passcode
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

export const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(422).json({
                message:"please fill all the required fields"
            })
        }

        const oldUser = await User.findOne({email})

        if(!oldUser){
            return res.status(401).json({ message: "Email or password is invalid" });
        }

        const isPasswordMatch = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Email or password is invalid" });
    }

    const accessToken = jwt.sign(
        { userId: oldUser._id },
        appTokens.accessTokenSecret,
        { subject: "accessApi", expiresIn: appTokens.accessTokenExpiresIn }
      );

      return res.status(200).json({
        id: oldUser._id,
        name: oldUser.name,
        email: oldUser.email,
        accessToken,
      
      });

    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            message:"internal server error"
        })
    }
}

export const verifyPasscode = async(req, res) => {
    try{

        const {passcode} = req.body;

        if(!passcode){
            return res.status(422).json({
                message:"Please insert passcode"
            })
        }

        const validPasscode = await User.findOne({passcode:passcode})
        if(!validPasscode){
            return res.status(401).json({
                message:"invalid passcode"
            })
        }
        return res.status(200).json({
            message:"Passcode validation successful"
        })
        

    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Error verifying passcode"
        })
    }
}
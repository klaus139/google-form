import appTokens from "../config/token.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export async function ensureAuthenticated(req, res, next) {
    // Extract token from Authorization header
    const accessToken = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!accessToken) {
        return res.status(401).json({
            message: "Access token not found",
        });
    }

    try {
        // Verify the token using the secret key
        const decodedAccessToken = jwt.verify(accessToken, appTokens.accessTokenSecret);

        //console.log('Decoded Access Token:', decodedAccessToken);

        // Attach the decoded token to the request object
        req.user = { id: decodedAccessToken.userId };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Access token expired", code: "AccessTokenExpired"
            });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Access Token Invalid", code: "AccessTokenInvalid"
            });
        } else {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}


// Ensure the user is authenticated and is an admin
export const authorizeAdmin = async (req, res, next) => {
  try {
    // If no userId in the request, the user is not authenticated
    const userId = req.user.id;  // The userId is assumed to be set in the req.user object after authentication

    // Find the user from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    // If the user is an admin, allow the request to proceed
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

import AppError from "../utils/appError.js";


// handling cast error
const castErrorHandler = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};


// handling duplicate fields error
const DuplicateFieldsErrorHandler = (err) => {
  const title = err.keyValue.title
  const message = `This eamil: ${email} has been used by another user. Please choose another`

  return new AppError(message, 400);
};


// handling validation error
const ValidationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const errorMessages =errors.join(". ")
  const message = `Invalid input data. ${errorMessages}`;

  return new AppError(message, 400);
};


// handling jwt errors
const jwtErrorHandler = () => new AppError("Invalid Token. Please login again!!!", 401)


const jwtExpireErrorHandler = () => new AppError("Your token has expired. Please login again!!!",401)


const DevError = (err,res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stackTrace: err.stack,
    
  });
};



const ProdError = (err,res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error("ERROR", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong... Please try again later!!!",
    });
  }
};



export default (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    DevError(err,res);
    
  } else if (process.env.NODE_ENV === "production") {

    // let error =JSON.parse(JSON.stringify(err));
    let error = {...err, name :err.name}
    // console.log(error)

    if (error.name === "CastError") error = castErrorHandler(error);

    if (error.code === 11000) error = DuplicateFieldsErrorHandler(error);

    if (error.name === "ValidationError")
      error = ValidationErrorHandler(error);

      if(error.name === "JsonWebTokenError") error = jwtErrorHandler()

      if(error.name === "TokenExpiredError") error = jwtExpireErrorHandler()

    ProdError(error,res);
  }
};
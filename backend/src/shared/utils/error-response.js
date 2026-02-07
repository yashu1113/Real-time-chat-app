export const errorResponse = (res, statusCode, message, error)=> {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    })  
}

export default errorResponse;

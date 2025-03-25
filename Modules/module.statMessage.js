const resMessage = (res, resCode, isOkay, error, message, data) => {
    const content = {};
    
    content.okay = isOkay;
    if (error != null) {
        content.error = error,
        content.message = message
    }
    if (data != null) {
        content.data = data
    }

    return res.status(resCode).json({ ...content });
};

export { resMessage }
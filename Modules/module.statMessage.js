const resMessage = (resCode, isOkay, error, message, data) => {
    const content = {};
    
    content.okay = isOkay;
    if (error != null) {
        content.error = error,
        content.message = message
    }
    if (data != null) {
        content.data = data
    }

    return resCode.status(resCode).json({ ...content });
};

export { resMessage as default };
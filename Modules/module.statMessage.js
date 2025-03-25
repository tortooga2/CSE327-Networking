const resMessage = (res, resCode, isOkay, { error = null, message = null, data = null }) => {
    const content = { okay: isOkay };

    if (error) {
        content.error = error;
    }
    if (message) {
        content.message = message;
    }
    if (data) {
        content.data = data;
    }

    return res.status(resCode).json({ ...content });
};

export { resMessage }
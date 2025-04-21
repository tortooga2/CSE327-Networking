import { Data } from "../Database/module.db.js";

const getFileChunk = async (req, res) => {
    const { profile_id } = req.user;
    const { limit = 10, chunk = 1, sort = 'id', order = 'DESC' } = req.query; //setting id and descending order by default made the most sense imo. 5 and 1 are arbitrary 

    try {
        const files = await Data.findAll({
            where: {
                creator_id: profile_id,
            },
            offset: (chunk - 1) * limit,
            limit: limit,

            order: [
                [`${sort}`, `${order}`],
            ],
        });

        if (files.length === 0) {
            return res.status(404).json({
                okay: true,
                message: "No files found",
            });
        }

        return res.status(200).json({
            okay: true,
            files: files,
        });    
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    };
};

export { getFileChunk };
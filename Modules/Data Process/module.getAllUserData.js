import { Data } from "../Database/module.db.js";
import { debugMessage, debugError } from "../module.debugHelpers.js";

export const getAllUserData = async (req, res) => {
    console.log("Get all user data");
    const { profile_id } = req.user;
    try {
        const data = await Data.findAll({
            attributes: [
                "id",
                "creator_username",
                "name",
                "type",
                "metadata",
                "parents",
                "children",
                "createdAt",
                "updatedAt",
            ],
            where: {
                owner_id: profile_id,
            },
        });

        debugMessage(data);
        res.status(200).json({
            okay: true,
            data: data,
        });
    } catch (err) {
        debugError(err);
        res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

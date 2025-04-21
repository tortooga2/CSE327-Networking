import { sequelize } from "../Database/module.db.js";
import { QueryTypes } from "sequelize";

const getFileChunk = async (req, res) => {
    const { profile_id } = req.user;
    const { limit = 10, chunk = 1, sort = 'id', order = 'DESC', search = '', userTimezone = 'PST' } = req.query; //setting id and descending order by default made the most sense imo. 5 and 1 are arbitrary 

    let searchQuery = new String(`
        SELECT * FROM "file_ledger"
        WHERE "creator_id" = '${profile_id}'
        `
    );

    try {
        if (search !== '') {
            searchQuery = await searchQuery.concat(" ", `
                AND (
                    (
                        word_similarity('${search}', "name") >= 0.3
                    )
                    OR '${search}' IN (
                        TO_CHAR(timezone('${userTimezone}',"createdAt"), 'Month DD YYYY'),
                        TO_CHAR(timezone('${userTimezone}',"createdAt"), 'MM-DD-YYYY')
                    )
                )
                `
            );
        };
    
        searchQuery = await searchQuery.concat(" ", `
            ORDER BY "${sort}" ${order}
            LIMIT ${limit} OFFSET ${(chunk - 1) * limit}
            `
        );

        console.log("The String: ", searchQuery);

        const files = await sequelize.query(searchQuery, {
            type: QueryTypes.SELECT,
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
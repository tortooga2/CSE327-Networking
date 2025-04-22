import { sequelize } from "../Database/module.db.js";
import { QueryTypes } from "sequelize";

//The main function for getting files in chunks
const getFileChunk = async (req, res) => {
    try {
        const searchQuery = await buildQuery(req);

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
        if (err instanceof TypeError) {
            return res.status(400).json({
                okay: false,
                error: "Bad request",
                message: err.message,
            });
        }
        
        return res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    };
};

//Function that constructs a raw SQL query based off given parameters
const buildQuery = async (req) => {
    const { sort = 'id', order = 'asc', search = '', type = '' } = req.query;
    const { profile_id } = req.user;

    //Input Validation
    const limit = await parseQueryString(req.query.limit, 10); //10 and 1 are arbitrary default values
    const chunk = await parseQueryString(req.query.chunk, 1);

    const allowedColumns = ['id', 'type', 'name', 'createdAt'];
    let isAllowed = false;

    for (let index = 0; index < allowedColumns.length; index++) {
        if (sort === allowedColumns[index]) {
            isAllowed = true;
        }
    }

    if (!isAllowed) {
        throw new TypeError("Tried to sort by an invalid column");
    }

    if (order.toLowerCase() !== 'desc' && order.toLowerCase() !== 'asc') {
        throw new TypeError("Sorting order must be DESC or ASC");
    }    

    let query = new String(`
        SELECT "id", "creator_username", "name", "type", "children", "createdAt"
        FROM "file_ledger"
        WHERE "owner_id" = '${profile_id}'
        `
    );

    if (search !== '') {
        query = query.concat(`
            AND word_similarity('${search}', "name") >= 0.3
            `
        );
    };

    if (type !== '') {
        query = query.concat(`
            AND "type" = '${type}'
            `
        );
    }

    query = query.concat(`
        ORDER BY "${sort}" ${order}
        LIMIT ${limit} OFFSET ${(chunk - 1) * limit}
        `
    );

    return query;
};

//Returns the provided default value if query is not an integer
const parseQueryString = async (query, defaultVal) => {
    if (query !== undefined) {
        const queryValue = parseInt(query, 10);

        if (isNaN(queryValue)) {
            throw new TypeError("Chunk and limit must be integers");
        }
    
        if (queryValue < 1) {
            throw new TypeError("Chunk and limit must be >= 1");
        }

        return queryValue
    } else {
        return defaultVal;
    }
};

export { getFileChunk };
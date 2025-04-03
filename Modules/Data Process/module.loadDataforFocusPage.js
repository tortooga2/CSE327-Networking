import { Data } from "../Database/module.db.js";
import { rebuildFile } from "./module.rebuildfile.js";

const unpackBundle = async (file) => {
    //Unpack the bundle and return the files
    const { children } = file;
    const fileIds = children.item_id;
    if (fileIds.length === 0) {
        return [];
    }
    const childrenData = await Data.findAll({
        where: {
            id: fileIds,
        },
    });

    console.log("Unpacking bundle: ", fileIds.length);
    const files = [];
    for (let child of childrenData) {
        if (child.type === "bundle") {
            const childrenIdsLayer2 = child.children.item_id;
            const childrenLayer2 = await Data.findAll({
                where: {
                    id: childrenIdsLayer2,
                },
            });
            files.push({
                ...child,
                children: childrenLayer2,
            });
        } else {
            const updatedFile = await rebuildFile(child);
            files.push(updatedFile);
        }
    }

    return {
        okay: true,
        files: {
            originalFile: file,
            files: files,
        },
    };
};

export const loadDataForFocusPage = async (req, res) => {
    const { fileId } = req.params;
    const { profile_id } = req.user;
    console.log("Loading data for focus page");
    try {
        const file = await Data.findByPk(fileId);
        if (!file) {
            return res.status(404).json({
                okay: false,
                error: "File not found",
                message: "The file you are looking for may not exist",
            });
        }

        if (file.owner_id != profile_id) {
            return res.status(403).json({
                okay: false,
                error: "Insufficient credentials",
                message: "This file does not belong to you",
            });
        }

        if (file.type === "bundle") {
            const unpackedFiles = await unpackBundle(file);
            return res.status(200).json(unpackedFiles);
        }
        const updatedFile = await rebuildFile(file);
        return res.status(200).json({
            okay: true,
            files: { originalFile: updatedFile },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            okay: false,
            error: "Unhandled exception",
            message: "The server encountered an unexpected condition",
        });
    }
};

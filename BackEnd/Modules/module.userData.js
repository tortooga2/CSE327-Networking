import { Data } from "./module.db.js";

const getAllUserData = async (req, res) => {
    const profile_id = req.profile_id;
    try {
        const data = await Data.findAll({
            where: {
                owner_id: profile_id,
            },
        });

        console.log(data);
        res.status(200).send({ data: data });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

const GenerateData = () => {
    const data = {};
    data.name = "This is just Test";
    data.type = "jpg";
    data.metadata = {
        key: "value",
    };
    data.parents = {
        item_id: [],
    };
    data.children = {
        item_id: [],
    };
    return data;
};

const testCreateUserData = async (req, res) => {
    const profile_id = req.profile_id;
    try {
        const newData = await Data.create({
            ...GenerateData(),
            owner_id: profile_id,
        });

        console.log(newData);
        res.status(200).send({ data: newData });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

const createUserData = async (req, res) => {
    const profile_id = req.profile_id;
    const { data } = req.body;

    try {
        const newData = await Data.create({
            ...data,
            owner_id: profile_id,
        });

        console.log(newData);
        res.status(200).send({ data: newData });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

export { getAllUserData, createUserData, testCreateUserData };

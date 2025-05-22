//Generate a random username for a user
const generateUsername = async (Users, desiredUsername) => {
    const cleanUsername = desiredUsername
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "")
        .trim();

    //Check if the username is already taken

    for (let i = 0; i < 100; i++) {
        const randomSuffix = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");

        const existingUser = await Users.findOne({
            where: {
                username_base: cleanUsername,
                username_suffix: randomSuffix,
            },
        });

        if (!existingUser) {
            return {
                username_base: cleanUsername,
                username_suffix: randomSuffix,
            };
        }
    }

    return null;
};

export { generateUsername };

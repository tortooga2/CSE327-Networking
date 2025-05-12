import { Data } from "./Modules/Database/module.db.js";

const updateMissingLocations = async () => {
    try {
        const filesToUpdate = await Data.findAll({
            where: { location: null },
        });

        for (let file of filesToUpdate) {
            file.location = "Undetermined";
            await file.save();
        }

        console.log(`✅ Updated ${filesToUpdate.length} files to have location "Undetermined".`);
    } catch (err) {
        console.error("❌ Error updating files:", err);
    } finally {
        process.exit();
    }
};

updateMissingLocations();

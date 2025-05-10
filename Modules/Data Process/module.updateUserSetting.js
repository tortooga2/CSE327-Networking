import { Users, UserSettings, sequelize } from "../Database/module.db.js";

const UpdateUserSetting = async (req, res) => {
    const { profile_id } = req.user;

    const {
        dark_mode,
        bundle_color,
        doc_color,
        note_color,
        rec_color,
        img_color,
        font_size,
        font_family,
    } = req.body;

    try {
        await UserSettings.update(
            {
                dark_mode,
                bundle_color,
                doc_color,
                note_color,
                rec_color,
                img_color,
                font_size,
                font_family,
            },
            {
                where: { profile_id },
            }
        );
        res.status(200).json({
            ok: true,
            data: {
                dark_mode,
                bundle_color,
                doc_color,
                note_color,
                rec_color,
                img_color,
                font_size,
                font_family,
            },
        });
    } catch (err) {
        res.status(501).json({
            ok: false,
            data: {
                dark_mode,
                bundle_color,
                doc_color,
                note_color,
                rec_color,
                img_color,
                font_size,
                font_family,
            },
        });
    }
};

export default UpdateUserSetting;

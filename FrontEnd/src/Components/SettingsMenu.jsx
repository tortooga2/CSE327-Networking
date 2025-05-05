import PropTypes from "prop-types";

import { useStore } from "./Contexts/ctx.appManager";
import VerticalDiv from "./UILayout/VerticalDiv";
import Button from "./Button/Button";

const SettingItem = ({ header, desc, children }) => {
    return (
        <div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
                <p style={{ fontWeight: "bold" }}>{header}</p>
                {children}
            </div>
            <p style={{ opacity: "0.6" }}>{desc}</p>
        </div>
    );
};

SettingItem.PropTypes = {
    header: PropTypes.string.isRequired,
    desc: PropTypes.string,
    children: PropTypes.element.isRequired,
};

const SettingsMenu = () => {
    return (
        <VerticalDiv>
            <p>Theme: </p>
            <SettingItem header={"Dark Mode: "}></SettingItem>
            <SettingItem header={"Bundle Color: "}></SettingItem>
        </VerticalDiv>
    );
};

export default SettingsMenu;

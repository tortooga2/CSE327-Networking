import "./Tag.css";
import getFileType from "../scripts/getFileType";

export const Bundle = () => {
    return <div className="tag bundle">Bundle</div>;
};

export const Document = () => {
    return <div className="tag doc">Document</div>;
};

export const Recording = () => {
    return <div className="tag vid">Recording</div>;
};

export const Note = () => {
    return <div className="tag note">Note</div>;
};

export const Img = () => {
    return <div className="tag img">Image</div>;
};

export const FileType = (filename) => {
    const fileType = getFileType(filename);
    switch (fileType) {
        case "Bundle":
            return <Bundle />;
        case "Document":
            return <Document />;
        case "Image":
            return <Img />;
        case "Note":
            return <Note />;
        case "Video":
            return <Recording />;
        default:
            return <p>Type ?</p>;
    }
};

{
    /* <div key={file.id} className="table-row" style={{
                                display: "grid",
                                gridTemplateColumns: "50px 180px 120px 150px 1fr 200px 120px",
                                padding: "16px 24px",
                                borderBottom: "1px solid #E2E8F0",
                                alignItems: "center"
                            }}>
                                <div>{file.id}</div>
                                <div>{new Date(file.createdAt).toLocaleDateString()}</div>
                                <div>{file.type}</div>
                                <div>{file.creator_username}</div>
                                <div>{file.name}</div>
                                <div>
                                    <textarea
                                        id={`note-${file.id}`}
                                        name={`note-${file.id}`}
                                        rows="3"
                                        cols="25"
                                        value={notes[file.id] || ''}
                                        onChange={(event) => handleNoteChange(file.id, event)}
                                        style={{ fontSize: "12px", width: "100%", height: "100%", boxSizing: "border-box" }}
                                    />
                                </div> */
}

const NoteCreation = () => {
    return (
        <div>
            <textarea></textarea>
            <button>Save</button>
        </div>
    );
};

export default NoteCreation;
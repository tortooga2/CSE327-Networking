import React, { useState } from 'react';
import NoteCreation from './NoteCreation';

const NoteTaker = () => {
    const [noteKeys, setNoteKeys] = useState([`initial-${Date.now()}`]);

    const addNote = () => {
        setNoteKeys([...noteKeys, `new-${Date.now()}`]);
    };

    return (
        <div>
            <button onClick = {addNote} style = {{ padding: '0.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}>
                Add Note
            </button>
            {noteKeys.map((key) => (
                <NoteCreation key = {key} fileId = {key.startsWith('new-') ? null : key} />
            ))}
        </div>
    );
};

export default NoteTaker;
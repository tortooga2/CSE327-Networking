import React, { useState, useEffect } from 'react';
import { useStore } from './Contexts/zus.fileManager';
import MDEditor from '@uiw/react-md-editor';
import Markdown from '@uiw/react-md-editor';


const NoteCreation = () => {
  const [noteText, setNoteText] = useState(useStore((state) => state.globalNote));
  const updateGlobalNote = useStore((state) => state.updateGlobalNote);
  const globalNote = useStore((state) => state.globalNote);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
 
  
  useEffect(() => {
    // Load initial note from Zustand if it exists
    setNoteText(globalNote);
  }, [globalNote]);
    
//     if (filesMap && fileId) {
//         const file = filesMap.get(fileId);
//         if (file && file.note) {
//             setNoteText(file.note);
//         }
//     }
//   }, [fileId, filesMap]); // Depend on 'files' to react to external updates

  const handleNoteChange = (value) => {
    setNoteText(value);
    setSaveStatus(null);
  };

  const handleSaveNote = async () => {
    // const updateFile = useStore((state) => state.updateFile);
    if (updateGlobalNote) {
        setSaveStatus('saving');
        const success = await updateGlobalNote(noteText);
        if (success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(null), 3000);
        } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(null), 5000);
        }
    } else {
        console.warn("Make sure to enter the fileId based on availablitity.");
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {saveStatus === 'saving' && <div style ={{ color: 'blue' }}>Saving note...</div>}
        {saveStatus === 'saved' && <div style ={{ color: 'green' }}>Note has been saved!</div>}
      <MDEditor
        value = {noteText}
        onChange = {handleNoteChange}
        style = {{ height: '250px' }}
      />
      <button onClick={handleSaveNote} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Save
      </button>
      {/* <button onClick = {togglePreview} style = {{ marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
      {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button> */}
      {/* {showPreview && ( 
        <div style = {{ marginTop: '1rem', border: '1px solid #ccc', padding: '0.5rem', whiteSpace: 'pre-wrap' }}>
           <Markdown source = {noteText} />
        </div>
      )} */}
      {saveStatus === 'saved' && <div style = {{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'gray' }} >(Saved!)</div>}
    </div>
  );
};

export default NoteCreation;
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from './Contexts/zus.fileManager';
import MDEditor from '@uiw/react-md-editor';
import Markdown from '@uiw/react-md-editor';


const NoteCreation = ({ fileId }) => { // Expect fileId as a prop
  const uploadFilesAction = useStore((state) => state.uploadFiles);
  const [noteText, setNoteText] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  const getFileData = useCallback(async () => {
    if (!fileId) {
      setNoteText('');
      return;
    }
   try { // remove the fetch api, where you want to store the Notetext object within the textfile and push the textfile into array, call the upload file into an array
      const response = await fetch(`/api/file/focus/${fileId}`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched note data:", data);
        if (data && data.note) {
          setNoteText(data.note);
        } else {
          setNoteText('');
        }
      } else {
        console.error("Failed to fetch note data:", response.statusText);
        setNoteText('');
     }
    } catch (error) {
      console.error("Error fetching note data:", error);
      setNoteText('');
    }
  }, [fileId, setNoteText]);

  useEffect(() => {
      getFileData();
  }, [getFileData]); // Fetch data whenever getFileData changes (i.e., when fileId changes)

  const handleNoteChange = (value) => {
    setNoteText(value);
    setSaveStatus(null);
  };

  const handleSaveNote = async () => {
    setSaveStatus('saving');
    const notefile = new File([noteText], "note.md", {
      type: "text/markdown",
    });

    // able to see how the notefile is sent to the array
    const textFileArr = [notefile];

    try {
      await uploadFilesAction(textFileArr); // array is referred by uploadFiles
      setSaveStatus('saved');
      console.log("Note is successfully uploaded.");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.log("Not being able to save note:", err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  
  return (
    <div>
      {saveStatus === 'saving' && <div>Saving note...</div>}
      {saveStatus === 'saved' && <div>Note saved!</div>}
      {saveStatus === 'error' && <div>Failed to save note.</div>}
      <MDEditor value={noteText} onChange={handleNoteChange} style={{ height: '300px' }} />
      <button
        onClick={handleSaveNote}
        style={{
          padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'black', border: 'none', cursor: 'pointer' 
        }}
      >
        Save Note
      </button>
      {/* <div style={{ marginTop: '1rem' }}> */}
        {/* {noteText} Simple preview */}
      {/* </div> */}
    </div>
  );
};
 

export default NoteCreation;
import { Route, Routes } from "react-router-dom";
import "./Upload.css";
import propTypes from "prop-types";
import { useState } from "react";

const fileMenu = document.getElementById('file-menu');
const fileUploadContainer = document.getElementById('file-upload-container');
const fileUpload = document.getElementById('file-upload');
const notesContainer = document.getElemenetById('notes-container');

fileMenu.addEventListener('click', () => {
    if (fileUploadContainer.style.display === 'block') {
        fileUploadContainer.style.display = 'none';
    } else {
        fileUploadContainer.style.display = 'block';
    }
});

fileUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.textContent = `File: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`;
        notesContainer.appendChild(fileItem);
        fileUploadContainer.style.display = 'none';
        fileUpload.value = '';
    }
});

function addNote() {
    const noteText = document.getElementById('new-note').value;
    if (noteText.trim() !== '') {
        const noteDivider = document.createElement('div');
        noteDivider.className = 'note';
        noteDivider.textContent = noteText;
        notesContainer.appendChild(noteDivider);
        document.getElementById('new-note').value = '';
    }
}
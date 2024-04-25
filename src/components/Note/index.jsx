import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import "./index.css";

export default function Note({ id, title, content, onNoteDeleted }) {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/notes/${id}/`);
      if (response.status === 204) {
        onNoteDeleted(id);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{content}</div>
      <div className="note-actions">
        <Link to={`edit/${id}`} className="edit-link">✏️</Link>
        <button onClick={handleDelete} className="delete-btn">Delete</button>
      </div>
    </div>
  );
}

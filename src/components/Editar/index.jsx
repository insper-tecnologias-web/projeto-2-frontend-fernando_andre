import axios from "axios";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppBar from "../Appbar";

export async function loader({ params }) {
    const note = await axios
                        .get(`http://localhost:8000/api/notes/${params.noteId}/`)
                        .then((response) => response.data);
    return { note };
}

export default function Editar() {
    const { note } = useLoaderData();
    const navigate = useNavigate();
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);

    const salvarNota = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/api/notes/${note.id}`, {
                title, content
            });
            if (response.status === 200) {
                navigate('/');
            }
        } catch (error) {
            console.error('Failed to save the note:', error);
            alert('Erro ao salvar a nota: ' + error.message);
        }
    };

    return (
        <>
            <AppBar />
            <main className="container">
                <form className="form-card" onSubmit={salvarNota}>
                    <input
                        className="form-card-title"
                        type="text"
                        name="titulo"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <textarea
                        className="autoresize"
                        name="detalhes"
                        value={content}
                        onChange={handleContentChange}
                    ></textarea>
                    <button className="btn" type="submit">Salvar</button>
                </form>
            </main>
        </>
    );
}

export const getNotes = async ({ age, search, page } = {}) => {
  try {
    const notes = await fetch(`/api/notes/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ age, search, page }),
    });
    return await notes.json();
  } catch (error) {
    console.error(error);
  }
};

export const createNote = async (title, text) => {
  try {
    const newNote = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text }),
    });
    return await newNote.json();
  } catch (error) {
    console.error(error);
  }
};

export const getNote = async (id) => {
  try {
    const data = await fetch(`/api/notes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await data.json();
  } catch (error) {
    console.error(error);
  }
};

export const archiveNote = async (id) => {
  try {
    const note = await fetch(`/api/notes/${id}/archiveNote`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ archived: false }),
    });
    return await note.json();
  } catch (error) {
    console.error(error);
  }
};

export const unarchiveNote = async (id) => {
  try {
    const note = await fetch(`/api/notes/${id}/archiveNote`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ archived: true }),
    });
    return await note.json();
  } catch (error) {
    console.error(error);
  }
};

export const editNote = async (id, title, text) => {
  try {
    const note = await fetch(`/api/notes/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text }),
    });
    return await note.json();
  } catch (error) {
    console.error(error);
  }
};

export const deleteNote = async (id) => {
  try {
    const note = await fetch(`/api/notes/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await note.json();
  } catch (error) {
    console.error(error);
  }
};

export const deleteAllArchived = async () => {
  try {
    const notes = await fetch("/api/notes/deleteAllArchived", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await notes.json();
  } catch (error) {
    console.error(error);
  }
};

export const notePdfUrl = async (id) => {
  try {
    const response = await fetch(`/api/notes/${id}/pdf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const contentDisposition = response.headers.get("Content-Disposition");
    const parts = contentDisposition.split("; ");
    let filename = "my-notes.pdf";
    for (const part of parts) {
      if (part.startsWith("filename=")) {
        filename = part.substring("filename=".length);
        break;
      }
    }
    const note = await response.blob();
    const url = window.URL.createObjectURL(note);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};

import { id } from "date-fns/locale";
import { awrap } from "@babel/runtime/regenerator";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch(url.replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) => {
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        });
  });
};

export const getNotes = async ({ age, search, page } = {}) => {
  const notes = await fetch(`/api/notes/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ age, search, page }),
  });
  return await notes.json();
};

export const createNote = async (title, text) => {
  const newNote = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, text }),
  });
  return await newNote.json();
};

export const getNote = async (id) => {
  const data = await fetch(`/api/notes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await data.json();
};

export const archiveNote = async (id) => {
  const note = await fetch(`/api/notes/${id}/archiveNote`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ archived: false }),
  });
  return await note.json();
};

export const unarchiveNote = async (id) => {
  const note = await fetch(`/api/notes/${id}/archiveNote`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ archived: true }),
  });
  return await note.json();
};

export const editNote = async (id, title, text) => {
  const note = await fetch(`/api/notes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, text }),
  });
  return await note.json();
};

export const deleteNote = async (id) => {
  const note = await fetch(`/api/notes/${id}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await note.json();
};

export const deleteAllArchived = async () => {
  const notes = await fetch("/api/notes/deleteAllArchived", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await notes.json();
};

export const notePdfUrl = (id) => {};

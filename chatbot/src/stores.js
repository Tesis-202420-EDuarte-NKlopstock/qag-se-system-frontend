import { writable } from "svelte/store";

// store para almacenar las conversaciones
export const conversations = writable({});

// store para almacenar el thread_id de conversación activo
export const activeThreadId = writable(null);

// store para almacenar el nombre del estudiante
export const studentName = writable("");

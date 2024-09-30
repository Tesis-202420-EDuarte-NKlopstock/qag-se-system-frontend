<script>
    import { createEventDispatcher } from 'svelte';

    let newMessage = '';
    const dispatch = createEventDispatcher();
    export let isInterrupted = false;  // Variable para saber si el flujo está interrumpido
    export let threadId = '';  // Se recibirá desde ChatBox el threadId actual

    const handleSend = () => {
        if (newMessage.trim()) {
            let messageObject;

            // Si la conversación está interrumpida, enviamos el mensaje como "user_answer"
            if (isInterrupted) {
                messageObject = {
                    "query": "",
                    "thread_id": threadId.startsWith('new') ? "" : threadId,  // Enviar "" si es una nueva conversación
                    "user_answer": newMessage
                };
            } else {
                // Si no está interrumpida, enviamos el mensaje normal con "query"
                messageObject = {
                    "thread_id": threadId.startsWith('new') ? "" : threadId,  // Enviar "" si es una nueva conversación
                    "query": newMessage
                };
            }

            // Emitir el mensaje al componente padre (ChatBox)
            dispatch('sendMessage', messageObject);
            newMessage = ''; // Limpiar el input después de enviar
        }
    };
</script>

<div class="message-input">
    <input bind:value={newMessage} placeholder="Escribe tu mensaje..." on:keypress="{e => e.key === 'Enter' && handleSend()}" />
    <button on:click={handleSend}>Enviar</button>
</div>

<style>
    .message-input {
        display: flex;
        border-top: 1px solid #ccc;
        padding: 10px;
    }

    input {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    button {
        margin-left: 10px;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
    }
</style>

<script>
    import { onMount } from 'svelte';  // Importar el hook onMount
    import { createEventDispatcher } from 'svelte';

    let newMessage = '';
    const dispatch = createEventDispatcher();
    export let isInterrupted = false;  // Variable para saber si el flujo está interrumpido
    export let threadId = '';  // Se recibirá desde ChatBox el threadId actual

    // Función que se ejecuta al enviar el mensaje
    const handleSend = () => {
        if (newMessage === '') return;
        
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

    // Enviar "Hola!" cuando el componente se carga
    onMount(() => {
        newMessage = 'Hola!';
        handleSend();  // Llamar a handleSend para enviar el mensaje automáticamente
    });
</script>

<div class="message-input">
    <input bind:value={newMessage} placeholder="Escribe tu mensaje..." on:keypress="{e => e.key === 'Enter' && handleSend()}" />
    <button on:click={handleSend}>Enviar</button>
</div>

<style>
    .message-input {
        display: flex;
        border-top: 1px solid #ccc;
        padding: 15px; /* Aumenta el padding del contenedor */
        background-color: white;
        border-radius: 0 0 10px 10px;
    }

    input {
        flex-grow: 1;
        padding: 18px; /* Aumenta el padding para hacer el input más alto */
        border: 1px solid #ccc;
        border-radius: 20px;
        font-size: 16px; /* Aumenta el tamaño del texto */
        outline: none;
    }

    button {
        margin-left: 10px;
        padding: 18px 30px; /* Aumenta el padding del botón */
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 20px;
        font-size: 16px; /* Aumenta el tamaño del texto del botón */
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3; /* Darker blue on hover */
    }
</style>

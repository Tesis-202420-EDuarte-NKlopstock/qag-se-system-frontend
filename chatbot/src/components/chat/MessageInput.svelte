<script>
    import { onMount } from 'svelte';  // Importar el hook onMount
    import { createEventDispatcher } from 'svelte';
    import { getPointsCounter } from '../../services/chatService.js';
    import { get } from 'svelte/store';

    let newMessage = '';
    let currentPoints = 0;
    let askedQuestions = 0;
    const dispatch = createEventDispatcher();
    export let isInterrupted = false;  // Variable para saber si el flujo está interrumpido
    export let threadId = '';  // Se recibirá desde ChatBox el threadId actual
    export let wasAnAskedQuestion = false;  // Variable para saber si se hizo una pregunta simple

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

    const updateCounters = async () => {
        console.log('[MessageInput] Se hizo una pregunta simple');
        const res = await getPointsCounter(threadId);
        currentPoints = res["current_points"];
        askedQuestions = res["asked_questions"];

        // Emitir evento para indicar que ya se hizo una pregunta
        dispatch('askedQuestion');
    };

    // Llamar a la función solo cuando `wasAnAskedQuestion` sea true
    $: if (wasAnAskedQuestion) {
        updateCounters();
    }

    // Enviar "Hola!" cuando el componente se carga
    onMount(() => {
        newMessage = 'Hola!';
        handleSend();  // Llamar a handleSend para enviar el mensaje automáticamente
    });
</script>

<div class="message-input">
    <input bind:value={newMessage} placeholder="Escribe tu mensaje..." on:keypress="{e => e.key === 'Enter' && handleSend()}" />
    <div class="points-counter">
        <span>{currentPoints}</span> /
        <span>{askedQuestions}</span>
    </div>
    <button on:click={handleSend}>Enviar</button>
</div>

<style>
    .message-input {
        display: flex;
        align-items: center;
        border-top: 1px solid #ccc;
        padding: 15px;
        background-color: white;
        border-radius: 0 0 10px 10px;
    }

    input {
        flex-grow: 1;
        height: 56px;
        padding: 0 18px;
        border-radius: 20px;
        font-size: 16px;
        border: 1px solid #ccc;
        outline: none;
    }

    .points-counter {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
        background-color: white;
        height: 56px;
        padding: 0 18px;
        border-radius: 20px;
        font-size: 16px;
        border: 1px solid #ccc;
    }

    button {
        margin-left: 10px;
        height: 56px;
        padding: 0 18px;
        border-radius: 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
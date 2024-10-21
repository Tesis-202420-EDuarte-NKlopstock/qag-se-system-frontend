<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import { getPointsCounter } from '../../services/chatService.js';
    import { timesInChatbot } from '../../stores.js';

    let newMessage = '';
    let currentPoints = 0;
    let askedQuestions = 0;
    const dispatch = createEventDispatcher();
    export let isInterrupted;  // Variable para saber si el flujo está interrumpido
    export let currentThreadId;  // Se recibirá desde ChatBox el currentThreadId actual
    export let wasAnAskedQuestion;  // Variable para saber si se hizo una pregunta simple

    // Función que se ejecuta al enviar el mensaje
    const handleSend = () => {
        console.log('ESTE 2', currentThreadId)
        if (newMessage === '') return;
        
        if (newMessage.trim()) {
            let messageObject;

            // Si la conversación está interrumpida, enviamos el mensaje como "user_answer"
            if (isInterrupted) {
                messageObject = {
                    "query": "",
                    "thread_id": currentThreadId,  // Enviar "" si es una nueva conversación
                    "user_answer": newMessage
                };
            } else {
                // Si no está interrumpida, enviamos el mensaje normal con "query"
                messageObject = {
                    "thread_id": currentThreadId,  // Enviar "" si es una nueva conversación
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
        const res = await getPointsCounter(currentThreadId);
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
        timesInChatbot.subscribe(times => {
            console.log('Times in chatbot', times);
            if (times === 0) {
                newMessage = 'Hola!';
                handleSend();  // Llamar a handleSend para enviar el mensaje automáticamente
            }
        });

        timesInChatbot.set(1);
    });
</script>

<div class="message-input">
    <input 
        bind:value={newMessage}
        placeholder="Escribe tu mensaje..."
        on:keypress="{e => e.key === 'Enter' && handleSend()}"
    />
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
        height: 40px;
        border-top: 1px solid #ccc;
        padding: 10px;
        background-color: white;
        border-radius: 0 0 10px 10px;
        gap: 10px;
    }

    input {
        flex-grow: 1;
        height: 30px;
        padding: 0 18px;
        border-radius: 20px;
        font-size: 12px;
        border: 1px solid #ccc;
        outline: none;
        box-sizing: border-box;
        margin-top: 8px;
    }

    .points-counter {
        display: flex; /* Asegurar que el contenido se alinee como flex */
        align-items: center; /* Centrar verticalmente el contenido */
        justify-content: center; /* Centrar horizontalmente el contenido */
        height: 30px; /* Asegurar altura consistente */
        padding: 0 18px;
        font-size: 16px;
        border-radius: 100px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        margin: 0; /* Eliminar márgenes */
        vertical-align: middle; /* Alinear verticalmente */
    }

    button {
        display: flex; /* Asegurar que el contenido se alinee como flex */
        align-items: center; /* Centrar verticalmente el contenido */
        justify-content: center; /* Centrar horizontalmente el contenido */
        height: 30px;
        padding: 0 10px;
        border-radius: 20px;
        font-size: 14px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
        flex-shrink: 0; /* Evitar que se encoja */
        margin-top: 7px;
    }

    button:hover {
      background-color: #2859cc;
    }

</style>
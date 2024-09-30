<!-- Componente con el input de texto donde el usuario escribe y envía el mensaje -->

<script>
    import { createEventDispatcher } from 'svelte';

    let newMessage = '';
    const dispatch = createEventDispatcher();

    const handleSend = () => {
        if (newMessage.trim()) {
            let messageObject = {
                "query": newMessage,
                "thread_id": ""
            };
            console.log('Enviando mensaje:', messageObject);
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

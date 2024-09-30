<!-- Componente principal donde se mostrarán los mensajes -->

<script>
    import MessageBubble from './MessageBubble.svelte';
    import MessageInput from './MessageInput.svelte';
    import { sendMessage } from '../services/chatService.js';
    import { conversations, activeThreadId } from '../stores.js';

    let messages = [];
    let currentThreadId = '';
    let isInterrupted = false;

    // Suscribirse a los cambios de la conversación activa
    activeThreadId.subscribe(id => {
        currentThreadId = id || '';
        conversations.subscribe(conv => {
            if (currentThreadId && conv[currentThreadId]) {
                messages = conv[currentThreadId].messages;  // Cargar los mensajes de la conversación activa
            } else {
                messages = [];
            }
        });
    });

    // Función que se ejecuta cuando el usuario envía un mensaje
    const handleSendMessage = async (message) => {
        try {
            const response = await sendMessage(message.detail);

            // Actualizar o crear una nueva conversación en el store
            conversations.update(conv => {
                let threadIdToUpdate = currentThreadId;

                // Si el thread_id no existe, obtenemos uno del backend
                if (!currentThreadId || currentThreadId.startsWith('new')) {
                    threadIdToUpdate = response.thread_id;
                    activeThreadId.set(threadIdToUpdate);
                }

                // Si la conversación era temporal, eliminamos la conversación vacía temporal
                if (currentThreadId && currentThreadId.startsWith('new')) {
                    delete conv[currentThreadId];
                }

                // Si no existe la conversación, inicializarla
                if (!conv[threadIdToUpdate]) {
                    conv[threadIdToUpdate] = { messages: [] };
                }

                // Agregar los mensajes del usuario y la respuesta del bot
                conv[threadIdToUpdate].messages = [
                    ...conv[threadIdToUpdate].messages,
                    { content: message.detail['query'] || message.detail['user_answer'], sender: 'user' },
                    { content: response['response'], sender: 'bot' }
                ];

                if (response.is_interrupted) {
                    isInterrupted = true;  // Marcar la conversación como interrumpida
                } else {
                    isInterrupted = false;  // Reiniciar si no hay interrupción
                }

                return conv;
            });
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    };
</script>

<div class="chatbox">
    <!-- Muestra todos los mensajes -->
    <div class="messages">
        {#each messages as message}
            <MessageBubble {message} />
        {/each}
    </div>

    <!-- Input para escribir y enviar mensajes -->
    <MessageInput on:sendMessage={handleSendMessage} {isInterrupted} threadId={currentThreadId} />
</div>

<style>
    .chatbox {
        display: flex;
        flex-direction: column;
        height: 100vh;
        border: 1px solid #ccc;
        padding: 10px;
    }

    .messages {
        flex-grow: 1;
        overflow-y: scroll;
        padding: 10px;
    }
</style>

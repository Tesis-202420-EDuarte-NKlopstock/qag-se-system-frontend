<script>
    import MessageBubble from './MessageBubble.svelte';
    import MessageInput from './MessageInput.svelte';
    import { sendMessage } from '../services/chatService.js';
    import { conversations, activeThreadId } from '../stores.js';

    let messages = [];
    let currentThreadId = '';
    let isInterrupted = false;
    let isLoading = false;  // Variable que controla el estado de carga

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
        // Mostrar el mensaje del usuario inmediatamente
        conversations.update(conv => {
            let threadIdToUpdate = currentThreadId;

            // Si no existe la conversación, inicializarla
            if (!conv[threadIdToUpdate]) {
                conv[threadIdToUpdate] = { messages: [] };
            }

            // Agregar el mensaje del usuario
            conv[threadIdToUpdate].messages = [
                ...conv[threadIdToUpdate].messages,
                { content: message.detail['query'] || message.detail['user_answer'], sender: 'user' }
            ];

            return conv;
        });

        // Mostrar animación de carga en la burbuja del bot
        isLoading = true;
        conversations.update(conv => {
            let threadIdToUpdate = currentThreadId;

            // Agregar un mensaje temporal que represente la animación de carga
            conv[threadIdToUpdate].messages = [
                ...conv[threadIdToUpdate].messages,
                { content: 'Cargando...', sender: 'bot', isLoading: true }  // Mensaje temporal del bot
            ];

            return conv;
        });

        // Obtener la respuesta del bot
        try {
            const response = await sendMessage(message.detail);

            // Actualizar la conversación con la respuesta real del bot
            conversations.update(conv => {
                let threadIdToUpdate = currentThreadId;

                // Si el thread_id no existe, obtenemos uno del backend
                if (!currentThreadId || currentThreadId.startsWith('new')) {
                    const realThreadId = response.thread_id;  // thread_id devuelto por el backend
                    conv[realThreadId] = conv[currentThreadId];  // Reemplazamos la conversación temporal con la real
                    delete conv[currentThreadId];  // Eliminamos la conversación temporal
                    threadIdToUpdate = realThreadId;  // Actualizamos el id de la conversación actual
                    activeThreadId.set(realThreadId);  // Actualizamos la conversación activa
                }

                // Actualizamos el mensaje de "Cargando..." con la respuesta del bot
                conv[threadIdToUpdate].messages = conv[threadIdToUpdate].messages.map(msg =>
                    msg.isLoading ? { content: response['response'], sender: 'bot' } : msg
                );

                if (response.is_interrupted) {
                    isInterrupted = true;  // Marcar la conversación como interrumpida
                } else {
                    isInterrupted = false;  // Reiniciar si no hay interrupción
                }

                return conv;
            });
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        } finally {
            isLoading = false;  // Ocultar la animación de carga
        }
    };
</script>

<div class="chatbox">
    <div class="chat-header">
        <div class="header-content">
            <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
            <h3>¡Bienvenido(a) a tu chat con Manchita! En la barra inferior puedes escribir tus preguntas y enviarlas con el botón a su derecha (o con la tecla enter). Manchita te las responderá tal como lo haría una persona real ¡Adelante y a preguntar!</h3>
        </div>
    </div>

    <!-- Onda debajo del header -->
    <img src="/assets/background.png" alt="Ola" class="wave-image" />

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
    .chat-header {
        padding: 15px;
        background-color: #3373F6; /* Color de fondo azul */
        border-bottom: 1px solid #ffffff;
        border-radius: 10px 10px 0 0;
        color: #ffffff;
        margin: 0;
        display: flex;
        align-items: center; /* Alinea verticalmente el logo y el texto */
        justify-content: space-between; /* Logo a la izquierda y texto a la derecha */
        font-size: 18px;
        font-family: Arial, sans-serif;
        position: relative;
        z-index: 1;
    }

    .header-content {
        display: flex;
        align-items: center;
    }

    .logo {
        width: 80px;  /* Ajusta el tamaño del logo */
        height: 80px;
        margin-right: 15px;
    }

    .wave-image {
        width: 100%;
        height: 40px;
        display: block;
        margin-top: -4px; /* Para que la ola toque el borde del header */
    }

    .chatbox {
        display: flex;
        flex-direction: column;
        height: 100vh; /* Full screen height */
        max-width: 100%;
        margin: 0 auto;
        border: 1px solid #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #ffffff;
        border-bottom: 1px solid #ffffff;
    }
</style>

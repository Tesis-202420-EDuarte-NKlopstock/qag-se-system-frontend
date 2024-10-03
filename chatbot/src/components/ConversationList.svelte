<script>
    import { conversations, activeThreadId } from '../stores.js';

    let convs;
    let currentThreadId;
    let isCurrentConversationEmpty = true; // Variable para verificar si la conversación activa está vacía

    // Función para comprobar si la conversación activa está vacía
    const checkIfCurrentConversationIsEmpty = () => {
        if (currentThreadId && convs[currentThreadId]) {
            isCurrentConversationEmpty = convs[currentThreadId].messages.length === 0;
        } else {
            isCurrentConversationEmpty = true; // Si no hay conversación activa, considerarla vacía
        }
    };

    // Suscribirse a los stores para manejar las conversaciones y la conversación activa
    conversations.subscribe(value => {
        convs = value;
        checkIfCurrentConversationIsEmpty(); // Comprobar si la conversación actual está vacía
    });

    activeThreadId.subscribe(id => {
        currentThreadId = id;
        checkIfCurrentConversationIsEmpty(); // Comprobar si la conversación actual está vacía
    });

    const setActiveConversation = async (id) => {
        activeThreadId.set(id);  // Cambia la conversación activa

        // Asegúrate de que el estado del backend esté sincronizado
        const response = await getConversationStateFromBackend(id);
        
        conversations.update(conv => {
            if (!conv[id]) {
                conv[id] = { messages: [] };  // Si no existe la conversación, inicializarla
            }

            conv[id].messages = response.messages || [];  // Actualizar los mensajes del estado del backend
            return conv;
        });
    };

    const createNewConversation = () => {
        // Solo crear una nueva conversación si la actual no está vacía
        if (!isCurrentConversationEmpty) {
            let newThreadId = 'new-' + Date.now();  // Crear un ID temporal único para la nueva conversación
            conversations.update(conv => {
                conv[newThreadId] = { messages: [] };  // Inicializar la conversación vacía
                return conv;
            });
            activeThreadId.set(newThreadId);  // Establecer la nueva conversación como la activa
        }
    };
</script>

<div class="conversation-list">
    <ul>
        {#each Object.keys(convs) as threadId}
            <li>
                <button on:click={() => setActiveConversation(threadId)}>
                    {threadId.startsWith('new') ? 'Nueva conversación' : threadId} - 
                    {convs[threadId].messages[0]?.content || 'Nueva conversación'}
                </button>
            </li>
        {/each}
    </ul>

    <!-- Botón para crear una nueva conversación, deshabilitado si la actual está vacía -->
    <button class="new-conversation-button" on:click={createNewConversation} disabled={isCurrentConversationEmpty}>
        + Nueva Conversación
    </button>
</div>

<style>
    .conversation-list {
        border-right: 1px solid #ccc;
        padding: 10px;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 10px;
    }

    button {
        background-color: #007bff;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .new-conversation-button {
        background-color: #28a745;
        margin-top: 10px;
    }

    .new-conversation-button:disabled {
        background-color: #ccc; /* Cambiar el estilo cuando esté deshabilitado */
        cursor: not-allowed;
    }
</style>

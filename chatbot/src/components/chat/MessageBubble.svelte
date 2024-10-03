<script>
    export let message;
</script>

<div class="message-bubble {message.sender}">
    {#if message.sender === 'bot'}
        <img src="/assets/logo_manchita_blue.png" alt="Bot logo" class="bot-logo" />
    {/if}
    
    <div class="bubble-content {message.sender}">
        <p>{message.content}</p>
    </div>

    {#if message.sender === 'user'}
        <i class="fas fa-user user-icon"></i> <!-- Ícono de usuario de Font Awesome -->
    {/if}
</div>

<style>
    /* Contenedor de todos los mensajes */
    .messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 15px;
        background-color: #ffffff;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .message-bubble {
        display: flex;
        align-items: flex-start;
        margin: 10px 0;
        width: 100%;
        font-family: Arial, sans-serif;
        word-wrap: break-word;
    }

    /* Logo del bot a la izquierda */
    .bot-logo {
        width: 35px;
        height: 35px;
        margin-right: 10px;
        /* border-radius: 50%; */
    }

    /* Estilo del cuadro de diálogo para el bot */
    .bubble-content.bot {
        background-color: #3373F6;
        color: #ffffff;
        border-radius: 10px;
        padding: 10px 15px;
        position: relative;
        margin-right: auto;
        max-width: 60%;
    }

    /* Estilo del cuadro de diálogo del usuario */
    .bubble-content.user {
        background-color: #ebeaff;
        color: #333;
        border-radius: 10px;
        padding: 10px 15px;
        margin-left: auto;
        position: relative;
        max-width: 60%;
    }

    /* Ícono de usuario a la derecha */
    .user-icon {
        font-size: 35px;
        margin-left: 10px; /* Espacio entre la burbuja y el ícono */
        color: #333;
    }

    /* Asegura que los mensajes del usuario se alineen completamente al borde derecho */
    .user {
        align-self: flex-end;
        margin-left: auto;
        margin-right: 0;
    }

    /* Triángulo del cuadro de diálogo del usuario */
    .bubble-content.user:after {
        content: "";
        position: absolute;
        top: 50%;
        right: -10px;
        transform: translateY(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: transparent transparent transparent #ebeaff;
    }

    p {
        margin: 0;
        line-height: 1.4;
    }
</style>
<!-- // Componente de las burbujas de mensajes para mostrar los mensajes enviados y recibidos -->

<script>
    export let message;
</script>

<div class="message {message.sender}">
    <p>{message.content}</p>
</div>

<style>
    .message {
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        max-width: 70%;
    }

    .user {
        background-color: #d0f0c0;
        align-self: flex-end;
    }

    .bot {
        background-color: #f0d0c0;
        align-self: flex-start;
    }
</style>

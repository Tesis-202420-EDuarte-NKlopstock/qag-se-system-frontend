<script>
    import { onMount } from 'svelte';
    
    export let code;

    onMount(() => {
        console.log('Código de Conocimiento:', code);
    });
</script>

<div class="centered-container">
    <h1 class="blue-text">Código de Conocimiento: {code}</h1>
</div>

<style>
    .centered-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Centra verticalmente en toda la altura de la pantalla */
        text-align: center; /* Centra el texto horizontalmente */
    }

    .blue-text {
        color: #4285F4; /* Color azul */
        font-size: 2em; /* Ajusta el tamaño de fuente según sea necesario */
    }
</style>

<script>
  import { onMount } from 'svelte';  // Importar el hook onMount
  import { navigate } from "svelte-routing";
  import Slideshow from "../components/slideshow/Slideshow.svelte";
  import { conversations, activeThreadId } from '../stores';
  import { verifyKnowledgeCode } from '../services/chatService.js';

  // Variable para manejar la visibilidad de la pantalla de bienvenida
  let code = "";

  // Función para manejar la navegación programáticamente
  async function goToGame() {
    if (code.length < 6) {
      alert("El código de conocimiento debe tener 6 caracteres");
      return;
    }

    const exists = await verifyKnowledgeCode(code);
    if (exists === true) {
      navigate(`/studentapp/towergame/${code.toUpperCase()}`);
    } else {
      alert("El código de conocimiento no existe");
      return
    }

    // showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
  }
  
  async function goToChatbot() {
    if (code.length < 6) {
      alert("El código de conocimiento debe tener 6 caracteres");
      return;
    }
    
    const exists = await verifyKnowledgeCode(code);
    if (exists === true) {
      console.log("Navegando al chatbot con el código:", code);
      navigate(`/studentapp/chatbot/${code.toUpperCase()}`);
    } else {
      alert("El código de conocimiento no existe");
      return
    }
    
    // showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
  }

  // Evento de retorno para manejar el botón de "back" del navegador
  window.addEventListener('popstate', () => {
    if (window.location.pathname === "/") {
      location.reload();
      // showWelcomeScreen = true;
    } else {
      location.reload();
      // showWelcomeScreen = false;
    }
    
    navigate("/");
  });

  onMount(() => {
    const path = window.location.pathname;
    console.log("StudentApp", path)
    navigate(path);
  });

</script>

<!-- Mostrar pantalla de bienvenida solo si `showWelcomeScreen` es true -->
<div class="welcome-screen">
    <div class="chat-header">
      <div class="header-content">
        <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
        <h3>¡Bienvenido(a) al Ambiente Gamificado de Manchita! ¡Elige una opción!</h3>
      </div>
    </div>
    
    <img src="/assets/background.png" alt="Ola" class="wave-image" />

    <!-- Manejo manual de la navegación -->
    <div class="game-section">
      <input type="text" placeholder="código de conocimiento" class="text-input" minlength="6" maxlength="6" bind:value={code} />
      <div class="game-buttons">
        <button on:click={goToGame}>Ir al juego de las torres</button>
        <button on:click={goToChatbot}>Ir al chatbot</button>
      </div>
    </div>

    <Slideshow />    
</div>

<style>
  .welcome-screen {
      text-align: center;
      height: 100vh; /* Toma toda la altura de la pantalla */
      overflow-y: auto; /* Habilita el scroll vertical si el contenido sobrepasa la pantalla */
    }

  .chat-header {
      padding-left: 10px;
      height: 10%;
      background-color: #3373F6;
      border-bottom: 1px solid #ffffff;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-family: Arial, sans-serif;
      z-index: 1;
  }

  .header-content {
      display: flex;
      align-items: center;
  }

  .logo {
      width: 5%;
      height: 5%;
      margin-right: 15px;
  }

  .wave-image {
      width: 100%;
      height: 40px;
      display: block;
      margin-top: -4px;
  }

  .game-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex: 1 1 50%; /* Ajusta el tamaño del contenedor de la derecha */
    padding-right: 50px; /* Espaciado a la derecha */
  }

  .text-input {
    width: 300px;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #3373F6;
    border-radius: 5px;
    text-align: center;
    margin-top: 50px;
    text-transform: uppercase;
  }

  .game-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    width: 100%;
  }

  button {
    background-color: #3373F6;
    color: white;
    border: none;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    width: 200px;
  }

  button:hover {
    background-color: #2859cc;
  }
</style>


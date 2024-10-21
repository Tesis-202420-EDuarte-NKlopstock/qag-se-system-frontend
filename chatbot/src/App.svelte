<script>
  import { onMount } from 'svelte';  // Importar el hook onMount
  import { Router, Route, navigate, link } from "svelte-routing";
  import ChatPage from "./pages/ChatPage.svelte";
  import TowerGame from "./components/tower_game/TowerGame.svelte";
  import Slideshow from "./components/slideshow/Slideshow.svelte";

  // Variable para manejar la visibilidad de la pantalla de bienvenida
  let showWelcomeScreen = true;

  // Función para manejar la navegación programáticamente
  function goToGame() {
      navigate("/towergame");
      showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
  }

  function goToChatbot() {
      navigate("/chatbot");
      showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
  }

  // Evento de retorno para manejar el botón de "back" del navegador
  window.addEventListener('popstate', () => {
      if (window.location.pathname === "/") {
          showWelcomeScreen = true;
      } else {
          showWelcomeScreen = false;
      }
  });

  onMount(() => {
    console.log(window.location.pathname)
    const path = window.location.pathname;
    if (path === "/") {
      showWelcomeScreen = true;
    } else {
      showWelcomeScreen = false;
    }
    navigate(path);
  });

</script>

<!-- Mostrar pantalla de bienvenida solo si `showWelcomeScreen` es true -->
{#if showWelcomeScreen}
  <div class="welcome-screen">
      <div class="chat-header">
        <div class="header-content">
            <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
            <h3>¡Bienvenido(a) al Ambiente Gamificado de Manchita! ¡Elige una opción!</h3>
        </div>
      </div>

      <img src="/assets/background.png" alt="Ola" class="wave-image" />

      <!-- Manejo manual de la navegación -->
      <div class="game-buttons">
        <button on:click={goToGame}>Ir al juego de las torres</button>
        <button on:click={goToChatbot}>Ir al chatbot</button>
      </div>

      <Slideshow />
  </div>
{/if}

<!-- Router para manejar las rutas -->
<Router>
  <Route path="/towergame" component={TowerGame} />
  <Route path="/chatbot" component={ChatPage} />
</Router>

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

  .game-buttons {
      margin-top: 50px;
  }

  button {
    background-color: #3373F6;
    color: white;
    border: none;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2859cc;
  }
</style>


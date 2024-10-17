<script>
  import { Router, Route, navigate, link } from "svelte-routing";
  import ChatPage from "./pages/ChatPage.svelte";
  import TowerGame from "./components/tower_game/TowerGame.svelte";

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

</script>

<!-- Mostrar pantalla de bienvenida solo si `showWelcomeScreen` es true -->
{#if showWelcomeScreen}
  <div class="welcome-screen">
      <h1>Bienvenido</h1>
      <p>Elige una opción:</p>

      <!-- Manejo manual de la navegación -->
      <button on:click={goToGame}>Ir al juego de las torres</button>
      <button on:click={goToChatbot}>Ir al chatbot</button>
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
      margin-top: 50px;
  }
  button {
      margin: 10px;
      padding: 10px 20px;
      font-size: 18px;
  }
</style>

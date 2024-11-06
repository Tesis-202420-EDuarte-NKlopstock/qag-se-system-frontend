<script>
  import { onMount } from 'svelte';  // Importar el hook onMount
  import { Router, Route, navigate } from "svelte-routing";
  import { studentName } from '../stores.js';
  import ChatBox from '../components/chat/ChatBox.svelte'
  import TowerGame from '../components/tower_game/TowerGame.svelte';
  import Slideshow from "../components/slideshow/Slideshow.svelte";
  import { verifyKnowledgeCode } from '../services/chatService.js';

  // Variable para manejar la visibilidad de la pantalla de bienvenida
  let code = "";
  let nameInput = "";

  // Función para manejar la navegación programáticamente
  async function goToTowerGame() {
    if (code.length < 6) {
      alert("El código de conocimiento debe tener 6 caracteres");
      return;
    }

    const exists = await verifyKnowledgeCode(code);
    // const exists = true;
    if (exists['database_path'] === true) {
      console.log("Navegando al chatbot con el código:", code);
      navigate(`/student-page/towergame/${code.toUpperCase()}`);
      // window.open(`/student-page/towergame/${code.toUpperCase()}`, '_blank');
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
    if (exists['database_path'] === true) {
      console.log("Navegando al chatbot con el código:", code);
      studentName.set(nameInput);
      navigate(`/student-page/chatbot/${code.toUpperCase()}`);
      // window.open(`/student-page/chatbot/${code.toUpperCase()}`, '_blank');
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
    console.log("Path actual:", path);
    // showWelcomeScreen = path === "/";
    navigate(path);
  });

</script>

<!-- Mostrar pantalla de bienvenida solo si `showWelcomeScreen` es true -->
<Router>
  <Route path="/" let:location key="{location.pathname}">
    <div class="welcome-screen">
        <div class="chat-header">
          <div class="header-content">
            <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
            <h3>¡Bienvenido(a) al Ambiente Gamificado de Manchita! ¡Elige una opción!</h3>
          </div>
        </div>
        
        <img src="/assets/background.png" alt="Ola" class="wave-image" />

        <div class="main-content">
          <Slideshow />

          <div class="game-section">
              <input type="text" placeholder="código de conocimiento" class="text-input" minlength="6" maxlength="6" bind:value={code} />
              <input type="text" placeholder="tu nombre" class="text-input second-input" bind:value={nameInput} />
              <div class="game-buttons">
                  <button on:click={goToTowerGame}>Ir al juego de las torres</button>
                  <button on:click={goToChatbot}>Ir al chatbot</button>
              </div>
          </div>
      </div>  
    </div>
  </Route>
  <Route path="/student-page/chatbot/:code" component={ChatBox} key="{location.pathname}" />
  <Route path="/student-page/towergame/:code" component={TowerGame} key="{location.pathname}" />
</Router>

<!-- <Router>
  <Route path="/chatbot/:code" component={ChatBox} />
  <Route path="/towergame/:code" component={TowerGame} />
</Router> -->

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

  .main-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 50px; /* Espaciado entre el slideshow y la sección de juego */
    /* padding: 20px; */
    margin-top: -40px;
  }

  .game-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding-right: 90px;
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

  .second-input {
    margin-top: 0;
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

  @media (max-width: 1024px) {
    .main-content {
        flex-direction: column; /* Cambia a columna en pantallas pequeñas */
    }

    .game-section {
      order: -1;
      margin-bottom: -80px;
      padding-right: 0px;
    }

  }
</style>


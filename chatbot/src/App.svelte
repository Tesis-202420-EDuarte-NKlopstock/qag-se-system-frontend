<script>
    import { onMount } from 'svelte';  // Importar el hook onMount
    import { Router, Route, navigate, link } from "svelte-routing";
    import TeacherApp from './pages/TeacherApp.svelte';
    import StudentApp from './pages/StudentApp.svelte';
    import ChatBox from './components/chat/ChatBox.svelte';
    import TowerGame from './components/tower_game/TowerGame.svelte';
  
    // Variable para manejar la visibilidad de la pantalla de bienvenida
    let showWelcomeScreen = true;
  
    // Función para manejar la navegación programáticamente
    function goToTeacherApp() {
        navigate("/teacherapp");
        showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
    }
  
    function goToStudentApp() {
        navigate("/studentapp");
        showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
    }
  
    // Evento de retorno para manejar el botón de "back" del navegador
    window.addEventListener('popstate', () => {
      if (window.location.pathname === "/") {
        location.reload();
        showWelcomeScreen = true;
      } else {
        location.reload();
        showWelcomeScreen = false;
      }
      
      navigate("/");
    });
  
    onMount(() => {
      console.log(window.location.pathname)
      const path = window.location.pathname;
      showWelcomeScreen = path === "/";
      navigate(path);
    });
  
  </script>
  
  <!-- Mostrar pantalla de bienvenida solo si `showWelcomeScreen` es true -->
  {#if showWelcomeScreen}
    <h2>MANCHITA GAMIFICADO</h2>
    <div class="container">
        <div class="image">
            <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
          </div>

        <!-- Manejo manual de la navegación -->
        <div class="buttons">
          <button on:click={goToTeacherApp}>¿Eres un profesor?</button>
          <button on:click={goToStudentApp}>¿Eres un estudiante?</button>
        </div>
    </div>
  {/if}
  
  <!-- Router para manejar las rutas -->
  <Router>
    <Route path="/teacherapp" component={TeacherApp} />
    <Route path="/studentapp" component={StudentApp} />
    <Route path="/studentapp/chatbot/:code" component={ChatBox} />
    <Route path="/studentapp/towergame/:code" component={TowerGame} />
  </Router>
  
  <style>
    h2 {
      text-align: center;
      margin: 0; /* Elimina márgenes superiores e inferiores */
      padding-top: 20px;
      font-size: xx-large;
      color: #4285F4;
      padding-top: 50px;
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: calc(100vh - 60px); /* Asegúrate de que el contenedor llene la pantalla, restando el espacio del h2 */
      margin: 0; /* Elimina márgenes adicionales */
    }

    .image {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #4285F4;
      padding-top: 100px;
      padding-bottom: 100px;
    }

    .image img {
      max-width: 100%;
      height: auto;
    }

    .buttons {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-left: 100px;
      padding-right: 100px;
    }

    button {
      background-color: #4285F4;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }

    button:hover {
      background-color: #357ae8;
    }
  </style>

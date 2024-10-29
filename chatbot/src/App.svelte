<script>
    import { onMount } from 'svelte';  // Importar el hook onMount
    import { Router, Route, navigate, link } from "svelte-routing";
    import TeacherPage from './pages/TeacherPage.svelte';
    import StudentPage from './pages/StudentPage.svelte';
    import ChatBox from './components/chat/ChatBox.svelte';
    import TowerGame from './components/tower_game/TowerGame.svelte';
  
    // Variable para manejar la visibilidad de la pantalla de bienvenida
    let showWelcomeScreen = true;
  
    // Función para manejar la navegación programáticamente
    function goToTeacherPage() {
        navigate("/teacher-page");
        showWelcomeScreen = false;  // Oculta la pantalla de bienvenida
    }
  
    function goToStudentPage() {
        navigate("/student-page");
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
          <button on:click={goToTeacherPage}>Soy un profesor</button>
          <button on:click={goToStudentPage}>Soy un estudiante</button>
        </div>
    </div>
  {/if}
  
  <!-- Router para manejar las rutas -->
  <Router>
    <Route path="/teacher-page" component={TeacherPage} />
    <Route path="/student-page" component={StudentPage} />
    <Route path="/student-page/chatbot/:code" component={ChatBox} />
    <Route path="/student-page/towergame/:code" component={TowerGame} />
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

<script>
  import { onMount } from 'svelte';  // Importar el hook onMount
  import { Router, Route, navigate, link } from "svelte-routing";
  import TeacherPage from './pages/TeacherPage.svelte';
  import StudentPage from './pages/StudentPage.svelte';
  import ChatBox from './components/chat/ChatBox.svelte';
  import TowerGame from './components/tower_game/TowerGame.svelte';

<<<<<<< HEAD
  let showWelcomeScreen = true;
=======
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
>>>>>>> 0a842f08e94dc2b6ca2bef0c385d3a2772d711ca

  function goToTeacherPage() {
      navigate("/teacher-page");
      showWelcomeScreen = false; 
  }

  function goToStudentPage() {
      navigate("/student-page");
      showWelcomeScreen = false;  
  }

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
    const path = window.location.pathname;
    showWelcomeScreen = path === "/";
    navigate(path);
  });
</script>

<!-- Mostrar pantalla de bienvenida solo si `showWelcomeScreen` es true -->
{#if showWelcomeScreen}
<div class="body">
  <h2>MANCHITA GAMIFICADO</h2>
  <div class="container">
      <div class="image">
          <img src="/assets/instructions/instr_system.jpeg" alt="instr_system" class="instr-system" />
      </div>
      <div class="buttons">
        <button on:click={goToTeacherPage}>Soy profesor</button>
        <button on:click={goToStudentPage}>Soy estudiante</button>
      </div>
  </div>
</div>
{/if}

<Router>
  <Route path="/teacher-page" component={TeacherPage} />
  <Route path="/student-page" component={StudentPage} />
  <Route path="/student-page/chatbot/:code" component={ChatBox} />
  <Route path="/student-page/towergame/:code" component={TowerGame} />
</Router>

<style>
h2 {
  text-align: center;
  margin: 0;
  font-size: 3rem; /* Título más grande */
  color: white;
  background-color: #4285F4;
}

.body {
  height: 100vh;
  overflow-y: auto; /* Activa el scroll vertical para toda la página en pantallas pequeñas */
}

.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(100vh - 120px); /* Asegura que el contenedor llene la pantalla, restando el espacio del título */
  padding: 0 5%;
  box-sizing: border-box;
}

.image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
  max-width: 900px; /* Imagen más grande */
}

.instr-system {
  width: 100%;
  height: auto;
}

.buttons {
  display: flex;
  flex-direction: column;
  margin-top: 300px;
  gap: 10px; /* Menor espacio entre botones */
  max-width: 200px;
  padding: 0 10px; /* Reduce espacio alrededor de los botones */
}

button {
  background-color: #4285F4;
  color: white;
  border: none;
  padding: 8px 16px; /* Botones más compactos */
  font-size: 18px; /* Texto más grande en los botones */
  cursor: pointer;
}

button:hover {
  background-color: #357ae8;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 1281px) {
  .body {
    overflow-y: auto; /* Activa el scroll vertical para toda la página en pantallas pequeñas */
  }

  .container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: auto;
    padding: 20px;
  }

  .image {
    margin-top: 20px;
    max-width: 80%; /* Aumenta el tamaño de la imagen en pantallas pequeñas */
  }

  .buttons {
    flex-direction: row; /* Cambia a disposición horizontal */
    gap: 10px; /* Ajusta el espacio entre botones en horizontal */
    max-width: 100%; /* Alinea los botones para que ocupen el ancho completo en pantallas pequeñas */
    justify-content: center; /* Centra los botones en horizontal */
    padding-top: 15px;
    margin-top: 10px;
  }
}
</style>

  <script>
    import { onMount, onDestroy } from "svelte";
    import { uploadFile } from '../services/chatService.js';
    import QandAs from '../components/qandas/QandAs.svelte';  // Importa el componente QandAs
    
    let selectedFiles = [];
    let isDragging = false;
    let isLoading = false;  // Estado de carga
    let showQandAs = false; // Estado para mostrar QandAs solo después de cargar los archivos
    let qAndAData = [];     // Almacenará el JSON recibido del backend
    let hasScrolled = false;

    // Función para manejar los archivos seleccionados
    function handleFileSelect(event) {
      selectedFiles = [...event.target.files];
    }

    // Función para manejar el arrastre de archivos
    function handleDrop(event) {
      event.preventDefault();
      isDragging = false;
      const files = [...event.dataTransfer.files];
      selectedFiles = files;
    }

    function handleDragOver(event) {
      event.preventDefault();
      isDragging = true;
    }

    function handleDragLeave() {
      isDragging = false;
    }

    // Función para cargar los archivos seleccionados
    async function handleUpload() {
      if (selectedFiles.length > 0) {
        isLoading = true;  // Activar estado de carga
        try {
          console.log("Archivos seleccionados:", selectedFiles);
          
          // Llamada a uploadFile y espera de la respuesta
          // qAndAData = await uploadFile(selectedFiles);
          
          // SOLO PARA TESTING:
          qAndAData = [
            {
              "code": "NKTQNH"
            },
            {
            "question": "¿Cuál es el objetivo general de la asignatura?",
            "choices": {
                "a": "Brindar al estudiante herramientas y conceptos básicos del uso de la informática en los procesos de creación, producción y difusión de productos desde el campo del diseño y el entorno artístico en general.",
                "b": "Conocer y comprender las nuevas tecnologías que se están introduciendo al campo del diseño y de las artes para la creación.",
                "c": "Facilitar al estudiante el aprendizaje de técnicas avanzadas de diseño y producción artística utilizando las herramientas informáticas más innovadoras.",
                "d": "Fomentar el desarrollo de habilidades digitales en el campo del diseño y las artes, permitiendo al estudiante utilizar las tecnologías de manera efectiva en su trabajo creativo."
            },
            "answer": "a",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es la bibliografía complementaria recomendada para la asignatura?",
            "choices": {
                "a": "Libro A",
                "b": "Libro B",
                "c": "Libro C",
                "d": "Libro D"
            },
            "answer": "a",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Qué vínculos se establecen entre el arte y la sociedad en la asignatura?",
            "choices": {
                "a": "El arte se utiliza como una forma de expresión individual sin relación con la sociedad.",
                "b": "El arte se utiliza como una forma de crítica social y promueve cambios en la sociedad.",
                "c": "El arte se utiliza como entretenimiento y no tiene impacto en la sociedad.",
                "d": "El arte se utiliza como una forma de escapismo y no refleja la realidad social."
            },
            "answer": "b",
            "type": "MCQ",
            "difficulty": "Fácil"
        },
        {
            "question": "¿Qué tipo de investigaciones se realizan en el semillero de Dramaturgia Performática en espacios no convencionales?",
            "choices": {
                "a": "Investigaciones sobre el uso de tecnología en la dramaturgia",
                "b": "Investigaciones sobre la relación entre música y dramaturgia",
                "c": "Investigaciones sobre la representación de género en la dramaturgia",
                "d": "Investigaciones sobre la interacción entre público y actor en espacios no convencionales"
            },
            "answer": "d",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es la función del blog Confessions of an Aca‐Fan?",
            "choices": {
                "a": "Compartir noticias y artículos sobre cine",
                "b": "Publicar reseñas de libros de diseño gráfico",
                "c": "Promover la inclusión en el campo del diseño gráfico",
                "d": "Investigar sobre el cine y sus representaciones"
            },
            "answer": "c) Promover la inclusión en el campo del diseño gráfico",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es el perfil del docente?",
            "choices": {
                "a": "Contar con experiencia docente en educación superior de por lo menos 2 años.",
                "b": "Poseer formación en docencia y experiencia probada en la docencia universitaria en diseño.",
                "c": "Tener una producción investigativa académica demostrable.",
                "d": "Todas las anteriores."
            },
            "answer": "d",
            "type": "MCQ",
            "difficulty": "Fácil"
        },
        {
            "question": "¿Cuál es la importancia de la interdisciplinariedad en el estudio de la poesía popular?",
            "choices": {
                "a": "Permite enriquecer la interpretación vocal de los textos",
                "b": "Facilita el estudio de la diversidad cultural en Colombia",
                "c": "Promueve la colaboración entre teatro, poesía, canto y música",
                "d": "Ayuda a comprender los componentes discursivos del ámbito estético"
            },
            "answer": "c",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuáles son algunos de los libros recomendados para la asignatura?",
            "choices": {
                "a": "Utopía para realistas",
                "b": "Teoría de la deriva",
                "c": "Intuición, acción, creación",
                "d": "Otro libro"
            },
            "answer": "a",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es la relación entre el arte y la memoria histórica institucional y regional?",
            "choices": {
                "a": "El arte no tiene relación con la memoria histórica",
                "b": "El arte permite preservar y transmitir la memoria histórica",
                "c": "El arte es independiente de la memoria histórica",
                "d": "La memoria histórica no tiene influencia en el arte"
            },
            "answer": "b",
            "type": "MCQ",
            "difficulty": "Fácil"
        },
        {
            "question": "¿Cuál es la importancia de implementar propuestas en publicaciones digitales?",
            "choices": {
                "a": "Atraer a un público más amplio",
                "b": "Mejorar la calidad de los contenidos",
                "c": "Facilitar la distribución y acceso a la información",
                "d": "Generar interacción y participación del público"
            },
            "answer": "c",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es el impacto del diseño gráfico en la sociedad?",
            "choices": {
                "a": "El diseño gráfico tiene un impacto mínimo en la sociedad.",
                "b": "El diseño gráfico tiene un impacto significativo en la sociedad al comunicar mensajes visuales de manera efectiva.",
                "c": "El diseño gráfico no tiene ningún impacto en la sociedad.",
                "d": "El impacto del diseño gráfico en la sociedad depende del contexto y la forma en que se utilice."
            },
            "answer": "b",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es la función del semillero de Animación en Bellas Artes?",
            "choices": {
                "a": "Explorar técnicas de animación tradicional",
                "b": "Realizar cortos animados con personajes creados por los estudiantes",
                "c": "Investigar sobre la relación entre arte y sostenibilidad",
                "d": "Desarrollar habilidades de emprendimiento cultural"
            },
            "answer": "b) Realizar cortos animados con personajes creados por los estudiantes",
            "type": "MCQ",
            "difficulty": "Fácil"
        },
        {
            "question": "¿Qué se busca lograr con el proyecto Reconocimiento Resultado de Material docente?",
            "choices": {
                "a": "Mejorar la calidad del material docente",
                "b": "Evaluar el desempeño del docente",
                "c": "Reconocer el resultado del material docente",
                "d": "Promover el uso de material docente"
            },
            "answer": "c) Reconocer el resultado del material docente",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Qué tipo de acciones promueve el proyecto de investigación Sondas de Profundidad?",
            "choices": {
                "a": "Acciones de investigación",
                "b": "Acciones de diseño",
                "c": "Acciones de producción",
                "d": "Acciones de impresión"
            },
            "answer": "a",
            "type": "MCQ",
            "difficulty": "Difícil"
        },
        {
            "question": "¿Cuál es la importancia de promover el desarrollo y fortalecimiento de capacidades en los sectores sociales?",
            "choices": {
                "a": "Mejora la calidad de vida de las personas.",
                "b": "Favorece el desarrollo económico.",
                "c": "Promueve la equidad y la inclusión social.",
                "d": "Incrementa la competitividad internacional."
            },
            "answer": "a",
            "type": "MCQ",
            "difficulty": "Fácil"
        },
        {
            "question": "¿Es cierto que el Instituto Departamental de Bellas Artes ofrece talleres gratuitos de animación para jóvenes y adolescentes en Cali, Colombia?",
            "choices": {
                "a": "Verdadero",
                "b": "Falso"
            },
            "answer": "Falso",
            "type": "TFQ",
            "difficulty": "Difícil"
        },
        {
            "question": "El Instituto Departamental de Bellas Artes cuenta con una política de disminución de barreras en infraestructura física.",
            "choices": {
                "a": "Verdadero",
                "b": "Falso"
            },
            "answer": "b",
            "type": "TFQ",
            "difficulty": "Difícil"
        }
          ]
          
          // Una vez cargado el archivo, muestra el componente QandAs
          showQandAs = true;
          alert(`${selectedFiles.length} archivo(s) cargado(s) con éxito`);
        } catch (error) {
          console.error("Error al cargar los archivos:", error);
          alert("Error al cargar los archivos");
        } finally {
          isLoading = false;  // Desactivar estado de carga
        }
      } else {
        alert("Por favor, selecciona o arrastra archivos primero.");
      }
    }

    // Función para detectar el scroll en el contenedor
    function handleScroll(event) {
      hasScrolled = event.detail.scrollTop > 0;
    }
  </script>
  
  <div class="teacher-app-container">
    <div class="chat-header">
      <div class="header-content">
        <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
        <h3>¡Bienvenido(a) profesor(a)! ¡Arrastra o selecciona un archivo para generar preguntas y respuestas!</h3>
      </div>
    </div>
    
    <img src="/assets/background.png" alt="Ola" class="wave-image" />
    
    <!-- Área de arrastrar o seleccionar archivos -->
    <div 
      class="drop-area" 
      on:drop={handleDrop} 
      on:dragover={handleDragOver} 
      on:dragleave={handleDragLeave}
      class:is-dragging={isDragging}>
      
      <p>{isDragging ? "Suelta los archivos aquí" : "Arrastra y suelta archivos aquí o haz clic para seleccionar"}</p>
      
      <input type="file" multiple on:change={handleFileSelect} hidden id="fileInput" />
      <button class="upload-btn" on:click={() => document.getElementById('fileInput').click()}>
        Seleccionar archivos
      </button>
    
      <!-- Mostrar archivos seleccionados dentro del área -->
      {#if selectedFiles.length > 0}
        <div class="file-list">
          <ul>
            {#each selectedFiles as file}
              <li>{file.name}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
    
    <!-- Botón de cargar -->
    <div class="button-container {hasScrolled ? 'scrolled': ''}">
      <button class="upload-btn" on:click={handleUpload} disabled={isLoading}>Cargar</button>
      <!-- {#if hasScrolled}
        <div class="scroll-line"></div>
      {/if} -->
    </div>
    
    <!-- Mostrar spinner de carga cuando isLoading es verdadero -->
    {#if isLoading}
      <div class="loading-spinner">
        <p>Cargando archivos...</p>
        <!-- Puedes usar un icono o una animación aquí, te doy un ejemplo simple -->
        <div class="spinner"></div>
      </div>
    {/if}

    {#if showQandAs}
      <QandAs {qAndAData} on:scroll={handleScroll} />
    {/if}
  </div>
  
  <style>
    .teacher-app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
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

    .drop-area {
      border: 2px dashed #ccc;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
      margin: 20px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .is-dragging {
      background-color: #f0f0f0;
    }
  
    .drop-area p {
      font-size: 16px;
      color: #888;
    }
  
    .file-list ul {
      list-style-type: none;
      padding: 0;
      margin-top: 10px;
    }
  
    .file-list li {
      background-color: #f9f9f9;
      padding: 5px;
      margin-bottom: 5px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      color: #555;
    }
  
    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    /* Línea que se mostrará al detectar scroll */
    .scroll-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: transparent; /* Se oculta inicialmente */
      transition: background-color 0.3s ease;
    }

    .scrolled {
      border-bottom: 2px solid #4285F4;
    }

    .upload-btn {
      background-color: #4285F4;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 5px;
    }

    .upload-btn:disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
    }

    .upload-btn:hover:not(:disabled) {
      background-color: #357ae8;
    }

    /* Spinner de carga */
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      margin-left: 10px;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border-left-color: #4285F4;
      animation: spin 1s linear infinite;
      margin-left: 20px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  </style>
  
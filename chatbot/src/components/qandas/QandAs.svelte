<script>
    import { createEventDispatcher, onMount } from "svelte";
  
    export let qAndAData = [];  // Se espera recibir el JSON completo como prop

    let questions = [];         // Para almacenar el contenido de preguntas ignorando el código
    let knowledgeCode = "";      // Para almacenar el código de conocimiento
  
    const dispatch = createEventDispatcher();

    // Procesa los datos y separa el código de conocimiento de las preguntas
    onMount(() => {
      if (qAndAData.length > 0) {
        knowledgeCode = qAndAData[0].code;
        questions = qAndAData.slice(1); // Ignora el primer elemento que contiene el código
      }
    });

    // Emitir el evento de scroll al componente padre
    function handleScroll(event) {
        const scrollTop = event.target.scrollTop;
        dispatch('scroll', { scrollTop });
    }
  
    // Función para descargar los datos como JSON
    function downloadJSON() {
      const now = new Date();
      const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ content: qAndAData }));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `QandAs_${knowledgeCode}.json`);
      downloadAnchor.click();
    }
  
    // Función para manejar el botón de "¡Empecemos!"
    function startQuiz() {
      alert("¡Empecemos!"); // Aquí podrías redirigir a la próxima pantalla o funcionalidad
    }
  
    // Actualiza las preguntas cuando se editen en la tabla
    function handleEdit(index, field, value) {
      questions[index][field] = value;
    }
  </script>
  
  <!-- Código de conocimiento -->
  <!-- <h3>Código de conocimiento: {knowledgeCode}</h3> -->
  <div class="qanda-container" on:scroll={handleScroll}>
    <!-- Tabla editable de preguntas y respuestas -->
    <table class="questions-table">
        <thead>
        <tr>
            <th>Pregunta</th>
            <th>Opciones</th>
            <th>Respuesta Correcta</th>
            <th>Tipo</th>
            <th>Dificultad</th>
        </tr>
        </thead>
        <tbody>
            {#each questions as question, index}
            <tr>
                <td contenteditable="true" on:input={(e) => handleEdit(index, 'question', e.target.textContent)}>
                    {question.question}
                </td>
                <td>
                    <ul>
                    {   #each Object.entries(question.choices) as [key, choice]}
                        <li data-letter={key} contenteditable="true" on:input={(e) => handleEdit(index, `choices.${key}`, e.target.textContent)}>
                            {choice}
                        </li>
                        {/each}
                    </ul>
                </td>
                <td contenteditable="true" on:input={(e) => handleEdit(index, 'answer', e.target.textContent)}>
                    {question.answer}
                </td>
                <td contenteditable="false" on:input={(e) => handleEdit(index, 'type', e.target.textContent)}>
                    {question.type}
                </td>
                <td contenteditable="true" on:input={(e) => handleEdit(index, 'difficulty', e.target.textContent)}>
                    {question.difficulty}
                </td>
            </tr>
            {/each}
        </tbody>
    </table>
  </div>
    
    <!-- Botones de acción -->
  <div class="sticky-buttons">
    <button on:click={downloadJSON}>Descargar</button>
    <button on:click={startQuiz}>¡Empecemos!</button>
  </div>
    
  <style>
    .qanda-container {
      overflow-y: auto;
      padding: 20px;
      margin: 0 auto;
      margin-bottom: 0;
    }
  
    .questions-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
  
    .questions-table th,
    .questions-table td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
  
    .questions-table th {
      background-color: #4285F4;
      color: white;
    }
  
    .questions-table td[contenteditable="true"] {
      background-color: #f9f9f9;
    }
  
    /* Estilo de las opciones sin puntos, solo letras a-d */
    .questions-table ul {
        list-style-type: none; /* Elimina los puntos de la lista */
        padding-left: 0;
    }

    .questions-table li::before {
        content: attr(data-letter) ". "; /* Añade las letras (a., b., c., d.) */
        font-weight: bold;
    }

    .sticky-buttons {
      position: sticky;
      bottom: 0;
      background-color: white;
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      border-top: 1px solid #ddd;
      /* margin-top: 20px; */
      height: 60px;
      width: 100%;
    }
  
    button {
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      background-color: #4285F4;
      color: white;
      margin-top: 10px;
    }
  
    button:hover {
      background-color: #357ae8;
    }
  </style>
  
<script>
  import { createEventDispatcher, onMount } from "svelte";

  export let qAndAData = [];  // Se espera recibir el JSON completo como prop

  let questions = [];         // Para almacenar el contenido de preguntas ignorando el código
  let knowledgeCode = "";      // Para almacenar el código de conocimiento

  const dispatch = createEventDispatcher();

  // Inicializa `questions` y `knowledgeCode` en `onMount` una sola vez
  onMount(() => {
      if (qAndAData.length > 0) {
          knowledgeCode = qAndAData[0].code;
          questions = qAndAData.slice(1).map(question => ({
              ...question,
              choices: question.choices || {} // Asegura que `choices` siempre esté definido como un objeto
          }));
      }
  });

  // Emitir el evento de scroll al componente padre
  function handleScroll(event) {
      const scrollTop = event.target.scrollTop;
      dispatch('scroll', { scrollTop });
  }

  // Función para descargar los datos como JSON
  function downloadJSON() {
      // Clona y limpia los datos actuales de `questions` para descargar
      const cleanedData = questions.map(question => {
          // Filtra las opciones vacías y reasigna las llaves secuencialmente
          const nonEmptyChoices = Object.values(question.choices)
              .filter(choice => choice.trim() !== "") // Filtra los valores no vacíos
              .reduce((acc, choice, i) => {
                  const newKey = String.fromCharCode(97 + i); // Genera las llaves secuenciales a, b, c, ...
                  acc[newKey] = choice;
                  return acc;
              }, {});

          return {
              ...question,
              choices: nonEmptyChoices
          };
      });

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ code: knowledgeCode, questions: cleanedData }));
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
      // Si el campo pertenece a `choices`, actualiza la clave correspondiente en `choices`
      if (field.startsWith("choices.")) {
          const choiceKey = field.split(".")[1]; // Obtiene la clave (a, b, c, etc.)
          questions[index].choices[choiceKey] = value;
      } else {
          questions[index][field] = value; // Para otros campos, actualiza directamente
      }
      questions = [...questions]; // Fuerza la reactividad
  }

  // Función para añadir una opción vacía en el objeto 'choices'
  function addEmptyOption(index) {
      // Asegúrate de que `choices` está definido como un objeto
      if (!questions[index].choices) {
          questions[index].choices = {};  // Si `choices` es undefined, inicialízalo como un objeto vacío
      }

      const question = structuredClone(questions[index]); // Hacer una copia profunda de la pregunta
      const choiceKeys = Object.keys(question.choices);
      const newKey = String.fromCharCode(97 + choiceKeys.length); // Genera una nueva clave ('a', 'b', 'c', ...)
      
      question.choices[newKey] = ""; // Agrega una nueva opción vacía con la clave `newKey`
      questions[index] = question; // Reemplaza la pregunta modificada en el array

      // Reasigna el array `questions` completo para activar la reactividad
      questions = [...questions];
  }
</script>

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
                  {#each Object.entries(question.choices) as [key, choice]}
                      <li data-letter={key} contenteditable="true" on:input={(e) => handleEdit(index, `choices.${key}`, e.target.textContent)}>
                          {choice}
                      </li>
                      {/each}
                  </ul>
                  <button class="add-choice-btn" on:click={() => addEmptyOption(index)}>+</button>
              </td>
              <td contenteditable="true" on:input={(e) => handleEdit(index, 'answer', e.target.textContent)}>
                  {question.answer}
              </td>
              <td contenteditable="true" on:input={(e) => handleEdit(index, 'type', e.target.textContent)}>
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
      max-width: 200px;
      word-wrap: break-word;
      white-space: normal;
  }

  .questions-table th {
      background-color: #4285F4;
      color: white;
  }

  .questions-table td[contenteditable="true"] {
      background-color: #f9f9f9;
  }

  .questions-table ul {
      list-style-type: none;
      padding-left: 0;
  }

  .questions-table li::before {
      content: attr(data-letter) ". ";
      font-weight: bold;
  }

  .add-choice-btn {
      display: block;
      padding: 1px 20px; /* Aumenta el tamaño del botón */
      font-size: 14px; /* Ajusta el tamaño del texto */
      background-color: #4285F4; /* Fondo negro */
      color: white; /* Texto blanco */
      border: none;
      cursor: pointer;
      width: 100%; /* Hace que el botón ocupe todo el ancho disponible */
      text-align: center;
      margin-top: 5px;
      border-radius: 5px; /* Opcional: redondea las esquinas */
  }

  .add-choice-btn:hover {
      background-color: #357ae8;
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

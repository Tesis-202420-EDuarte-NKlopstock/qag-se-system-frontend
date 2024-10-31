<script>
    import { onDestroy, onMount } from "svelte";
    import { evaluateAnswer, getQuestions, sendMessage } from '../../services/chatService.js';
    import Block from "./Block.svelte";
    import { trusted } from "svelte/internal";

    let blocks = []; // Arreglo para almacenar los bloques
    let blockIdCounter = 0;  // Contador para generar ids únicos
    let yPositions = {}; // Objetos para llevar el estado de la posición Y de los bloques
    let fixedBlocks = {};  // Objetos para llevar el estado de los bloques fijados
    let xPosition = 150; // Posición horizontal por defecto
    let fixedBlockCount = 0;  // Contador de bloques fijados
    let highestFixedBlockY = 600;  // Altura inicial del bloque más alto fijado
    let sumTotalHeight = 0;  // Suma de la altura de todos los bloques fijados
    let gameOver = false;  // Estado del juego
    let currentBlock = null;  // Bloque que está siendo respondido
    let totalFixedBlocks = 0;  // Total de bloques fijados

    let questions = []; // Arreglo para almacenar las preguntas
    let usedQuestions = []; // Arreglo para almacenar las preguntas ya usadas
    let answer = "";  // Respuesta ingresada por el usuario
    let currentColor = "";

    export let code;

    onMount(async () => {
      console.log('Código de Conocimiento:', code);

      questions = await getQuestions(code); // Inicializar preguntas
      console.log(questions.length > 0);
      console.log(typeof(questions));
    });

    function getRandomColor() {
        const letters = '0123456789ABC';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }

        return color;
    }

    // Función para agregar un nuevo bloque
    function dropBlock() {
        if (questions.length > 0 && !gameOver) {
            // Selecciona una pregunta aleatoria
            const randomIndex = Math.floor(Math.random() * questions.length);
            const randomQuestion = questions[randomIndex];
            const color = getRandomColor();

            // Crear un nuevo bloque con un id único
            const newBlock = { id: blockIdCounter++, question: randomQuestion, answer: "", color }; // id es para generar preguntas para siempre jiji
            blocks.push(newBlock);
            yPositions[newBlock.id] = -10;  // Inicializa la posición Y del bloque
            fixedBlocks[newBlock.id] = false;  // Inicializa el estado de "no fijado"
            
            // Si no hay un bloque activo, el primer bloque creado se convierte en el currentBlock
            if (currentBlock === null) {
                currentBlock = newBlock;
                currentColor = color;
            }

            // Mover la pregunta seleccionada de `questions` a `usedQuestions`
            usedQuestions.push(randomQuestion);
            questions.splice(randomIndex, 1);

            // Si solo queda una pregunta en el arreglo `questions`, restablecer el original
            if (questions.length === 0) {
                questions = [...usedQuestions];  // Restablece `questions` con las preguntas usadas
                usedQuestions = [];  // Vacía `usedQuestions` para volver a empezar
            }

            console.log("Nuevo bloque añadido:", newBlock);
        } else {
            console.log("No hay más preguntas o el juego ha terminado.");
        }
    }

    // Verifica si algún bloque ha superado la altura del bloque más alto fijado
    function checkGameOver() {
        blocks.forEach((block) => {
            if (!fixedBlocks[block.id] && (yPositions[block.id] - 20) >= highestFixedBlockY) {
                console.log("¡Fin del juego! Un bloque ha pasado la altura permitida.");
                gameOver = true;
                clearIntervals();  // Detiene los intervalos
            }
        });
    }

    // Guardar el estado de un refresh intencional antes de que ocurra el reload
    function triggerIntentionalRefresh() {
        sessionStorage.setItem("intentionalRefresh", "true");  // Almacena la intención del refresh
        location.reload();  // Recargar la página
    }

    // Función para detener todos los intervalos
    function clearIntervals() {
        clearInterval(interval);  // Detiene la caída de bloques
        clearInterval(dropBlockInterval);  // Detiene la generación de nuevos bloques
    }

    // Simula la caída de los bloques cada 200ms
    const interval = setInterval(() => {
        if (!gameOver) {
            blocks.forEach((block) => {
                if (!fixedBlocks[block.id]) {  // Solo actualiza si el bloque no está fijado
                    yPositions[block.id] += 12;  // Incrementa la posición Y (caída)

                    // Verifica si el bloque ha llegado al fondo del área de juego
                    if (yPositions[block.id] >= 370) {  // 600 es la altura del área de juego, 50 es la altura del bloque
                        console.log(`El bloque ${block.id} ha llegado al fondo.`);
                        clearIntervals();  // Detiene la caída de bloques y la generación de nuevos
                        gameOver = true;  // Termina el juego
                    }

                    if (!fixedBlocks[block.id] && yPositions[block.id] >= (highestFixedBlockY - 25)) {
                        console.log("¡Fin del juego! Un bloque ha pasado la altura permitida.");
                        clearIntervals();  // Llama a la función que detiene todos los intervalos
                        gameOver = true;
                    }
                }
            });
            checkGameOver();  // Verifica si el juego debe terminar
        }
    }, 800);  // Intervalo de caída

    // Intervalo para soltar un nuevo bloque cada 3 segundos
    const dropBlockInterval = setInterval(() => {
        if (!gameOver) {
            dropBlock();
        }
    }, 6000);

    // Validar la respuesta ingresada
    async function checkAnswer() {
        if (answer === '') return;  

        if (!currentBlock) {
            console.log("No hay bloques para responder.");
            return;
        }

        currentBlock.answer = answer;  // Actualiza la respuesta del bloque actual
        let evaluation = await evaluateAnswer(currentBlock, code);

        if (evaluation['evaluation'] === true) {
            console.log("¡Respuesta correcta!", currentBlock.id);

            // Coloca el bloque en la parte inferior del área de juego y lo fija
            yPositions[currentBlock.id] = 360 - (fixedBlockCount * 20);  // Ajusta la posición Y
            fixedBlocks[currentBlock.id] = true;  // Marca este bloque como "fijado"
            fixedBlockCount++;  // Incrementa el número de bloques fijados
            totalFixedBlocks++;  // Incrementa el número total de bloques fijados
            sumTotalHeight += 20;  // Actualiza la altura total de los bloques fijados

            // Actualiza la altura del bloque más alto fijado
            highestFixedBlockY = yPositions[currentBlock.id];

            // Verifica si hay 10 bloques fijados
            if (fixedBlockCount >= 10) {
                setTimeout(() => {
                    // Elimina los primeros 9 bloques del arreglo de bloques y ajusta sus posiciones
                    blocks.splice(0, 9);
                    blocks.forEach((block, index) => {
                        yPositions[block.id] = 360 - (index * 20);
                    });

                    // Mantén actualizados los bloques fijados
                    Object.keys(fixedBlocks).forEach((question, index) => {
                        if (index < 8) {
                            delete fixedBlocks[question];
                        }
                    });
                    fixedBlockCount -= 9;  // Ajusta el contador de bloques fijados
                });
            }

            // Actualiza el currentBlock al siguiente bloque más reciente
            const blockIndex = blocks.indexOf(currentBlock);
            if (blockIndex + 1 < blocks.length) {
                currentBlock = blocks[blockIndex + 1];  // El siguiente bloque en el orden de salida
                currentColor = currentBlock.color;
            } else {
                currentBlock = null;  // No hay más bloques por responder
                currentColor = null;
            }

        } else {
            console.log("Respuesta incorrecta", currentBlock ? currentBlock.id : "");

            // Termina el juego si la respuesta es incorrecta
            clearIntervals();  // Detiene la caída de bloques y la generación de nuevos
            gameOver = true;
        }

        // Limpiar el campo de respuesta
        answer = "";
    }

    // Limpia los intervalos cuando el componente se destruye
    onDestroy(() => {
        clearIntervals();
    });
</script>

<div class="welcome-screen">
  <div class="chat-header">
    <div class="header-content">
        <img src="/assets/logo_manchita_white.png" alt="Logo" class="logo" />
        <h3>¡Contruye la torre más alta!</h3>
    </div>
  </div>
  <img src="/assets/background.png" alt="Ola" class="wave-image" />
</div>

<!-- Área principal que contiene la torre y las preguntas a la derecha -->
<div class="game-container">
  <!-- Torre de bloques -->
  <div class="game-area">
    {#if gameOver}
    <div class="overlay">
      <div class="game-over">¡Perdiste! El juego ha terminado.</div>
      <div class="game-over">Puntaje: {totalFixedBlocks} - Altura: {sumTotalHeight}</div>
      <button class="reload-button" on:click={() => location.reload()}>Volver a Jugar</button>
    </div>
    {/if}

    {#each blocks as block (block.id)}
      <Block
        {block}
        yPosition={yPositions[block.id]}
        {xPosition}
        color={block.color}
      />
    {/each}
  </div>

  <!-- Preguntas y campo de respuesta -->
  <div class="question-area">
    <div class="question-container">
      <p class="question-text" style="color: {currentColor}">
        {#if currentBlock !== null}
          {currentBlock.question}
        {:else}
          ¡Atento! ¡Ya viene una nueva pregunta!
        {/if}
      </p>
    </div>

    <div class="answer-area">
      <input
        type="text"
        bind:value={answer}
        placeholder="Tu respuesta"
        on:keypress="{e => e.key === 'Enter' && checkAnswer()}"
        disabled={gameOver}
      />
      <button on:click={checkAnswer}>Enviar</button>
    </div>
  </div>
</div>

<style>
  .welcome-screen {
      text-align: center;
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
      width: 7%;
      height: 7%;
      margin-right: 15px;
  }

  .wave-image {
      width: 100%;
      height: 40px;
      display: block;
      margin-top: -4px;
      margin-bottom: 30px;
  }

  .game-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 20px; /* Espacio entre la torre y la sección de preguntas */
    max-height: 80vh; /* Limita la altura del contenedor para permitir scroll */
    overflow-y: auto; /* Activa el scroll vertical */
  }

  /* Área de juego solo con borde inferior */
  .game-area {
    position: relative;
    height: 380px;
    width: 500px;
    border-bottom: 2px solid black; /* Solo borde inferior */
    margin: 0 auto;
    overflow: hidden;
    margin-left: 25%;
    margin-top: -2px;
  }

  /* Área de las preguntas a la derecha */
  .question-area {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 300px;
    padding-top: 100px;
    padding-right: 300px;
  }

  .question-text {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .answer-area {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  input {
    width: 160px;
    padding: 8px;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  button {
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #2859cc;
  }

  .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);  /* Fondo semi-transparente */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;  /* Asegura que esté sobre los bloques */
  }

  .game-over {
    color: red;
    font-size: 24px;
    text-align: center;
    margin-top: 20px;
  }

  .reload-button {
    padding: 10px 20px;
    font-size: 18px;
    background-color: #3373F6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    z-index: 12;
    transition: background-color 0.3s ease;
  }

  .reload-button:hover {
    background-color: #0048d8;
  }

  @media (max-width: 1045px) {
  .game-container {
    display: flex;
    flex-direction: column; /* Coloca el game-area encima del question-area */
    align-items: center;
    justify-content: flex-start;
    height: 100vh; /* Ocupa toda la pantalla */
    overflow: hidden; /* Evita el scroll vertical */
    gap: 10px; /* Espacio entre la torre y la sección de preguntas */
  }

  .game-area {
    flex-shrink: 0;
    position: relative;
    height: 380px;
    width: 300px;
    border-bottom: 2px solid black;
    overflow: hidden;
    margin-left: 30%;
  }

  .question-area {
    display: flex;
    flex-direction: row; /* Permite que la pregunta crezca horizontalmente hacia la derecha */
    align-items: center; /* Centra la pregunta verticalmente */
    justify-content: flex-start;
    padding: 20px; /* Añade algo de espacio alrededor */
    width: auto; /* Permite que la pregunta crezca sin limitarse */
    max-width: 90vw; /* Limita la expansión para mantenerla dentro del viewport */
    overflow-x: auto; /* Añade scroll horizontal si el contenido es muy grande */
    margin-top: -2px;
  }

  .question-container {
    max-width: 100%;
    text-align: left;
    word-wrap: break-word;
  }

  .question-text {
    line-height: 1.5;
    overflow: visible; /* Permite que el texto crezca hacia la derecha */
  }
}

@media (max-width: 560px) {
  .game-area {
    width: 250px;
    margin-left: 17%;
    margin-top: -30px;
  }

  .answer-area {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
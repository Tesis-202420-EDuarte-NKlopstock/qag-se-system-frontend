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

    let code = "";

    onMount(async () => {
      const params = new URLSearchParams(window.location.search);
      code = params.get('code') || "";
      console.log('Código de Conocimiento:', code);

      questions = await getQuestions(); // Inicializar preguntas
      console.log(questions.length > 0);
      console.log(typeof(questions));
    });

    // Función para agregar un nuevo bloque
    function dropBlock() {
        if (questions.length > 0 && !gameOver) {
            // Selecciona una pregunta aleatoria
            const randomIndex = Math.floor(Math.random() * questions.length);
            const randomQuestion = questions[randomIndex];

            // Crear un nuevo bloque con un id único
            const newBlock = { id: blockIdCounter++, question: randomQuestion, answer: "" }; // id es para generar preguntas para siempre jiji
            blocks.push(newBlock);
            yPositions[newBlock.id] = 0;  // Inicializa la posición Y del bloque
            fixedBlocks[newBlock.id] = false;  // Inicializa el estado de "no fijado"
            
            // Si no hay un bloque activo, el primer bloque creado se convierte en el currentBlock
            if (currentBlock === null) {
                currentBlock = newBlock;
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
            if (!fixedBlocks[block.id] && (yPositions[block.id] - 50) >= highestFixedBlockY) {
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
                    if (yPositions[block.id] >= 310) {  // 600 es la altura del área de juego, 50 es la altura del bloque
                        console.log(`El bloque ${block.id} ha llegado al fondo.`);
                        clearIntervals();  // Detiene la caída de bloques y la generación de nuevos
                        gameOver = true;  // Termina el juego
                    }

                    if (!fixedBlocks[block.id] && yPositions[block.id] >= (highestFixedBlockY - 30)) {
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
        let evaluation = await evaluateAnswer(currentBlock);

        if (evaluation['evaluation'] === true) {
            console.log("¡Respuesta correcta!", currentBlock.id);

            // Coloca el bloque en la parte inferior del área de juego y lo fija
            yPositions[currentBlock.id] = 310 - (fixedBlockCount * 70);  // Ajusta la posición Y
            fixedBlocks[currentBlock.id] = true;  // Marca este bloque como "fijado"
            fixedBlockCount++;  // Incrementa el número de bloques fijados
            totalFixedBlocks++;  // Incrementa el número total de bloques fijados
            sumTotalHeight += 70;  // Actualiza la altura total de los bloques fijados

            // Actualiza la altura del bloque más alto fijado
            highestFixedBlockY = yPositions[currentBlock.id];

            // Verifica si hay 4 bloques fijados
            if (fixedBlockCount >= 4) {
                // Elimina los primeros 3 bloques del arreglo de bloques y ajusta sus posiciones
                blocks.splice(0, 3);
                blocks.forEach((block, index) => {
                    yPositions[block.id] = 310 - (index * 70);
                });

                // Mantén actualizados los bloques fijados
                Object.keys(fixedBlocks).forEach((question, index) => {
                    if (index < 1) {
                        delete fixedBlocks[question];
                    }
                });
                fixedBlockCount -= 3;  // Ajusta el contador de bloques fijados
            }

            // Actualiza el currentBlock al siguiente bloque más reciente
            const blockIndex = blocks.indexOf(currentBlock);
            if (blockIndex + 1 < blocks.length) {
                currentBlock = blocks[blockIndex + 1];  // El siguiente bloque en el orden de salida
            } else {
                currentBlock = null;  // No hay más bloques por responder
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

<!-- Área de juego -->
<div class="game-area">
  {#if gameOver}
  <div class="overlay">
    <div class="game-over">
      ¡Perdiste! El juego ha terminado.
    </div>
    <div class="game-over">
      Puntaje: {totalFixedBlocks} - Altura: {sumTotalHeight}
    </div>
    <button class="reload-button" on:click={() => location.reload()}>Volver a Jugar</button>
  </div>
  {/if}

  {#each blocks as block (block.id)}
    <Block {block} yPosition={yPositions[block.id]} {xPosition} />
  {/each}
</div>

<!-- Campo de respuesta y botón en la parte inferior -->
<div class="answer-area">
  <input type="text" bind:value={answer} placeholder="Tu respuesta" on:keypress="{e => e.key === 'Enter' && checkAnswer()}" />
  <button on:click={checkAnswer}>Enviar</button>
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

  .game-area {
    position: relative;
    height: 380px;
    width: 400px;
    border: 2px solid black;
    margin: 0 auto;
    overflow: hidden;
  }

  /* .game-area {
    position: relative;
    height: 60vh; 
    width: 40vw; 
    border: 2px solid black;
    margin: 0 auto;
    overflow: hidden;
  } */

  .answer-area {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
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

  /* input {
    width: 200px;
    padding: 10px;
    border-radius: 20px;
    margin-right: 10px;
    font-size: 16px;
    outline: none;
    border: 1px solid #ccc;
    box-sizing: border-box;
  } */

  input {
    width: 20vw; /* Ajusta el ancho del input al 50% del viewport */
    padding: 10px;
    border-radius: 20px;
    margin-right: 10px;
    font-size: 16px; /* Usa unidades rem para la fuente */
    outline: none;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  /* button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex-shrink: 0;
  } */

  button {
    padding: 10px 20px;  /* Tamaño de los botones en unidades rem */
    font-size: 16px;  /* Tamaño de la fuente en rem */
    border-radius: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    flex-shrink: 0;
  }

  button:hover {
      background-color: #2859cc;
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
</style>

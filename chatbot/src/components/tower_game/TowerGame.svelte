<script>
    import { onDestroy } from "svelte";
    import Block from "./Block.svelte";
  
    let blocks = [];
    let yPositions = {};
    let fixedBlocks = {};  // Objetos para llevar el estado de los bloques fijados
    let xPosition = 150; // Posición horizontal por defecto
    let currentQuestionIndex = 0;
    let fixedBlockCount = 0;  // Contador de bloques fijados
    let highestFixedBlockY = 600;  // Altura inicial del bloque más alto fijado
    let sumTotalHeight = 0;  // Suma de la altura de todos los bloques fijados
    let gameOver = false;  // Estado del juego
    
    let questions = [
      { question: "¿Cuál es la capital de Francia?", answer: "París" },
      { question: "¿Cuánto es 2 + 2?", answer: "4" },
      { question: "¿Qué es el agua en inglés?", answer: "water" }
    ];
  
    let answer = "";  // Respuesta ingresada por el usuario
    let currentBlock = null;  // Bloque que está siendo respondido
  
    // Función para agregar un nuevo bloque
    function dropBlock() {
      if (currentQuestionIndex < questions.length && !gameOver) {
        const newBlock = { ...questions[currentQuestionIndex] };
        blocks.push(newBlock);
        yPositions[newBlock.question] = 0;  // Inicializa la posición Y del bloque
        fixedBlocks[newBlock.question] = false;  // Inicializa el estado de "no fijado"
  
        // Si no hay un bloque actual, el primer bloque que se añade se convierte en currentBlock
        if (currentBlock === null) {
          currentBlock = newBlock;
        }
  
        currentQuestionIndex++;
        console.log("Nuevo bloque añadido:", newBlock);
      } else {
        console.log("No hay más preguntas.");
      }
    }
  
    // Verifica si algún bloque ha superado la altura del bloque más alto fijado
    function checkGameOver() {
      blocks.forEach((block) => {
        if (!fixedBlocks[block.question] && (yPositions[block.question] - 50) >= highestFixedBlockY) {
          console.log("¡Fin del juego! Un bloque ha pasado la altura permitida.");
          gameOver = true;
          clearIntervals();  // Llama a la función que detiene todos los intervalos
        }
      });
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
            if (!fixedBlocks[block.question]) {  // Solo actualiza si el bloque no está fijado
                yPositions[block.question] += 12;  // Incrementa la posición Y (caída)
                
                // Verifica si el bloque ha llegado al fondo del área de juego
                if (yPositions[block.question] >= 548) {  // 600 es la altura del área de juego, 50 es la altura del bloque
                    console.log(`El bloque ${block.question} ha llegado al fondo.`);
                    clearIntervals();  // Detiene la caída de bloques y la generación de nuevos
                    gameOver = true;  // Termina el juego
                }
                
                if (!fixedBlocks[block.question] && yPositions[block.question] >= (highestFixedBlockY - 30)) {
                    console.log("¡Fin del juego! Un bloque ha pasado la altura permitida.");
                    clearIntervals();  // Llama a la función que detiene todos los intervalos
                    gameOver = true;
                }
            }
            });
            checkGameOver();  // Verifica si el juego debe terminar
        }
        }, 200);
  
    // Empieza a soltar bloques cada 5 segundos
    const dropBlockInterval = setInterval(() => {
      if (!gameOver) {
        dropBlock();
      }
    }, 3000);
  
    // Validar la respuesta ingresada
    function checkAnswer() {
      if (currentBlock && currentBlock.answer === answer) {
        console.log("¡Respuesta correcta!", currentBlock.question);
  
        // Coloca el bloque en la parte inferior del área de juego y lo fija
        yPositions[currentBlock.question] = 600 - (fixedBlockCount * 52) - 52;  // Ajusta la posición Y
        fixedBlocks[currentBlock.question] = true;  // Marca este bloque como "fijado"
        fixedBlockCount++;  // Incrementa el número de bloques fijados
        sumTotalHeight += 52;  // Actualiza la altura total de los bloques fijados
  
        // Actualiza la altura del bloque más alto fijado
        highestFixedBlockY = yPositions[currentBlock.question];
  
        // Actualiza currentBlock al siguiente bloque más reciente
        const blockIndex = blocks.indexOf(currentBlock);
        if (blockIndex + 1 < blocks.length) {
          currentBlock = blocks[blockIndex + 1];  // El siguiente bloque en el orden de salida
        } else {
          currentBlock = null;  // No hay más bloques por responder
        }
  
      } else {
        console.log("Respuesta incorrecta", currentBlock ? currentBlock.question : "");
  
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
  
  <!-- Área de juego -->
  <div class="game-area">
    {#if gameOver}
    <div class="overlay">
      <div class="game-over">
        ¡Perdiste! El juego ha terminado.
      </div>
      <div class="game-over">
        Puntaje: {fixedBlockCount} - Altura: {sumTotalHeight}
      </div>
      <button class="reload-button" on:click={() => location.reload()}>Volver a Jugar</button>
    </div>
    {/if}
  
    {#each blocks as block (block.question)}
      <Block {block} yPosition={yPositions[block.question]} {xPosition} />
    {/each}
  </div>
  
  <!-- Campo de respuesta y botón en la parte inferior -->
  <div class="answer-area">
    <input type="text" bind:value={answer} placeholder="Tu respuesta" on:keypress="{e => e.key === 'Enter' && checkAnswer()}" />
    <button on:click={checkAnswer}>Enviar</button>
  </div>
  
  <style>
    .game-area {
      position: relative;
      height: 600px;
      width: 600px;
      border: 2px solid black;
      margin: 0 auto;
      overflow: hidden;
    }
  
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
  
    input {
      width: 200px;
      padding: 10px;
      margin-right: 10px;
      font-size: 16px;
    }
  
    button {
      padding: 10px 20px;
      font-size: 16px;
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
  
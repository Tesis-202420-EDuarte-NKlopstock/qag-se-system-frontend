<script>
    export let block;
    export let yPosition;
    export let xPosition = 0;  // Ya no necesitamos cambiarlo, lo manejamos en CSS
  </script>
  
  <!-- Representación visual del bloque -->
  <div class="block" style="top: {yPosition}px;">
    <div class="question">{block.question}</div>
  </div>
  
  <style>
    .block {
      position: absolute;
      width: 60%;  /* El ancho del bloque es el 60% del contenedor */
      height: 50px;
      background-color: lightblue;
      border: 1px solid black;
      left: 50%;  /* Centrar el bloque horizontalmente */
      transform: translateX(-50%);
      transition: top 0.5s ease;  /* Aumentamos el tiempo de transición a 0.5s */
    }
  
    .question {
      font-size: 14px;
      margin-bottom: 5px;
    }
  </style>
  
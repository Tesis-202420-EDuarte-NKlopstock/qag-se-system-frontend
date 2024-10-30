<script>
    export let block;
    export let yPosition;
    export let xPosition;  // Ya no necesitamos cambiarlo, lo manejamos en CSS
    export let color;
</script>

<!-- Representación visual del bloque -->
<div class="block" style="top: {yPosition}px; background-color: {color}"></div>

<style>
  .block {
    position: absolute;
    width: 20%;  /* El ancho del bloque es el 60% del contenedor */
    height: 20px;
    border: 1px solid black;
    left: 50%;  /* Centrar el bloque horizontalmente */
    transform: translateX(-50%);
    transition: top 0.5s ease;  /* Aumentamos el tiempo de transición a 0.5s */
  }
</style>
  
<script>
    // Textos que aparecerán en el slideshow
    let slides = [
        [
          'assets/instructions/instr_start.png'
        ],
        [
          'assets/instructions/instr_chatbot.png'
        ],
        [
          'assets/instructions/instr_stories.png'
        ],
        [
          'assets/instructions/instr_towergame.png'
        ]
    ];

    // Variable para controlar el slide actual
    let currentSlide = 0;
  
    // Función para ir al slide anterior
    function prevSlide() {
      currentSlide = (currentSlide === 0) ? slides.length - 1 : currentSlide - 1;
    }
  
    // Función para ir al siguiente slide
    function nextSlide() {
      currentSlide = (currentSlide === slides.length - 1) ? 0 : currentSlide + 1;
    }
  </script>
  
  <div class="slideshow-container">
    <div class="slide">
      <!-- Muestra múltiples párrafos para cada slide -->
      {#each slides[currentSlide] as imageSrc}
        <img src="{imageSrc}" alt="" />
      {/each}
    </div>
    <div class="controls">
      <button on:click={prevSlide}>⟨</button>
      <button on:click={nextSlide}>⟩</button>
    </div>
  </div>
  
  <style>
    .slideshow-container {
      margin-top: 50px;
      text-align: center;
    }
  
    .slide {
      width: 80%; /* Ajusta el ancho del contenedor */
      margin: 0 auto; /* Centra el contenedor */
      overflow: hidden; /* Oculta cualquier desbordamiento si lo hubiera */
    }

    .slide p {
      font-size: 18px;
      font-family: Arial, sans-serif;
      word-wrap: break-word; /* Permite que el texto se ajuste a la siguiente línea si es necesario */
      white-space: normal; /* Asegura que el texto haga el ajuste de línea automáticamente */
      text-align: justify; /* Justifica el texto */
    }

    .slide img {
      height: 50%;
      width: 100%;
    }   
  
    .controls {
      margin-top: -20px;
    }
  
    button {
      /* height: 0px; */
      width: 70px;
      background-color: #3373F6;
      color: white;
      border: none;
      padding: 10px;
      font-size: 18px;
      cursor: pointer;
      margin-bottom: 40px;
    }
  
    button:hover {
      background-color: #2859cc;
    }

    @media (max-width: 1024px) {
      .slide img {
        height: 50%;
        width: 100%;
      }

      button {
          margin-top: 10px;
      }
    }
  </style>

<script>
    // Textos que aparecerán en el slideshow
    let slides = [
        [
            "¡Bienvenido(a) al Ambiente Gamificado de Manchita!",
            "Una aclaración importante:",
            `Te damos la bienvenida a Manchita, el asistente virtual del Instituto
            Departamental de Bellas Artes. Este recurso ha sido creado exclusivamente
            para brindar apoyo en el aprendizaje sobre el proceso de acreditación académica
            del Instituto. La información proporcionada está diseñada específicamente para
            facilitar la investigación, comprensión y cumplimiento de los estándares de calidad
            exigidos para la acreditación. Además, encontrarás herramientas que te ayudarán en
            la elaboración de trabajos relacionados con este proceso académico, así como
            información sobre normativas y aspectos clave de bienestar universitario vinculados
            al mismo. Actualmente estamos en una fase de prueba.
            Agradecemos tu participación como usuario Beta, tu retroalimentación nos
            ayudará a corregir y mejorar cualquier error que pueda surgir.`,
            `Entendemos que al iniciar tu interacción estarás de acuerdo con participar
            en está investigación, por tanto comunicate con trato respetuoso, cordial
            y no incluyas información personal o sensible en esta interacción. Ten en
            cuenta que las respuestas pueden tardar un poco debido al tiempo de procesamiento,
            estamos trabajando para optimizar la velocidad de respuesta. Es posible que encuentres
            algunas areas en que la información pueda ser afinada o mejorada o incluso desacertada,
            por lo que te invitamos a consultar las fuentes oficiales para confirmar.`,
            `Tu contribución es vital para perfeccionar este asistente, gracias por formar parte de
            este proceso y ayudarnos a construir una herramienta más efectiva para la comunidad de
            Bellas Artes.`,
            "Empezamos ¿Sí o no?"
        ],
        [
            "Intrucciones para el uso de Manchita Chatbot",
            `Manchita Chatbot es un asistente que te ayudará a resolver tus dudas sobre la acreditación
            acadmécica del Instituto Departamental de Bellas Artes. Además, te ayudará a evaluar tus
            conocimientos sobre el tema. Esta evaluación se hará por medio de preguntas con las que podrás
            ganar puntos.`,
            "¿Cómo gano puntos?",
            `Para ganar puntos usando Manchita Chatbot, debes responder correctamente preguntas.
            Para esto, debes decirle a Manchita que quieres una pregunta. Si la contestas bien, ganas
            un punto. Si la contestas mal, no ganas nada.`,
            `Solo tienes un intento para responder cada pregunta que le pides. Si respondiste mal,
            puedes pedirle que te diga la respuesta correcta y pedirle otra pregunta.`,
            `Si respondiste bien, en la parte de abajo, al lado izquierdo del botón "Enviar", verás un contador
            con la cantidad de puntos que has ganado y el total de preguntas que te ha hecho Manchita.`
        ],
        [
            "¡También, está la opción de las historias!",
            `Las historias son una forma de evaluar conocimientos de manera diferente. En ellas, se
            narra una historia con tres (3) personajes. Cada uno te hace una pregunta. Si la respondes
            bien, puedes continuar con el juego.`,
            `¡Luego de responder bien una pregunta, dile a Manchita que siga con la historia!`,
            `Le puedes decir algo como: "¡Sigue con la historia, Manchita!"`,
            `¡Tienes tres vidas en toda la historia para responder correctamente!`,
            `Para jugar las historias, le puedes decir a Manchita, por ejemplo, "¡Quiero jugar las historias!".`
        ],
        [
            "¡Por último, está el juego de construir la torre más alta!",
            `En esta forma de evaluación de conocimiento, van a empezar a caer bloques con preguntas. Cada vez que
            respondas bien una pregunta, el bloque va a caer livianamente y se va a sumar a tu torre.`,
            `Si respondes mal, el bloque va a caer muy fuerte sobre la torre y la tumbará por completo...`,
            `¡Sé rápido y preciso para responder más preguntas y construir la torre más alta!`
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
      {#each slides[currentSlide] as paragraph}
        <p>{paragraph}</p>
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
  
    .controls {
      margin-top: 10px;
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
    }
  
    button:hover {
      background-color: #2859cc;
    }
  </style>

<script>
  import { onMount, onDestroy } from "svelte";
  import { uploadFile } from '../services/chatService.js';
  import QandAs from '../components/qandas/QandAs.svelte';

  let selectedFiles1 = [];
  let selectedFiles2 = [];
  let isDragging1 = false;
  let isDragging2 = false;
  let isLoading = false;
  let showQandAs = false;
  let qAndAData = [];
  let hasScrolled = false;

  function handleFileSelect(event, area) {
      if (area === 1) {
          selectedFiles1 = [...event.target.files];
      } else {
          selectedFiles2 = [...event.target.files];
      }
  }

  function handleDrop(event, area) {
      event.preventDefault();
      if (area === 1) {
          isDragging1 = false;
          selectedFiles1 = [...event.dataTransfer.files];
      } else {
          isDragging2 = false;
          selectedFiles2 = [...event.dataTransfer.files];
      }
  }

  function handleDragOver(event, area) {
      event.preventDefault();
      if (area === 1) {
          isDragging1 = true;
      } else {
          isDragging2 = true;
      }
  }

  function handleDragLeave(area) {
      if (area === 1) {
          isDragging1 = false;
      } else {
          isDragging2 = false;
      }
  }

  async function handleUpload() {
      if (selectedFiles1.length === 0) {
          alert("Carga un documento de conocimiento");
          return;
      }
      
      if (selectedFiles1.length > 0) {
          isLoading = true;
          try {
              const filesToUpload = [...selectedFiles1, ...selectedFiles2];
              console.log("Archivos seleccionados:", filesToUpload);

              qAndAData = await uploadFile(selectedFiles1, selectedFiles2);

              showQandAs = true;
              alert(`${filesToUpload.length} archivo(s) cargado(s) con éxito`);
          } catch (error) {
              console.error("Error al cargar los archivos:", error);
              alert("Error al cargar los archivos");
          } finally {
              isLoading = false;
          }
      } else {
          alert("Por favor, selecciona o arrastra archivos primero.");
      }
  }

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

  <!-- Contenedor de áreas de arrastre -->
  <div class="drop-area-container">
      <!-- Primera área de arrastre -->
      <div 
          class="drop-area" 
          on:drop={(event) => handleDrop(event, 1)} 
          on:dragover={(event) => handleDragOver(event, 1)} 
          on:dragleave={() => handleDragLeave(1)}
          class:is-dragging={isDragging1}>

          <p>{isDragging1 ? "Suelta los archivos aquí" : "Carga de Conocimiento: Arrastra y suelta archivos aquí o haz clic para seleccionar"}</p>
          <input type="file" multiple on:change={(event) => handleFileSelect(event, 1)} hidden id="fileInput1" />
          <button class="upload-btn" on:click={() => document.getElementById('fileInput1').click()}>Seleccionar archivos</button>
          {#if selectedFiles1.length > 0}
              <div class="file-list">
                  <ul>
                      {#each selectedFiles1 as file}
                          <li>{file.name}</li>
                      {/each}
                  </ul>
              </div>
          {/if}
      </div>

      <!-- Segunda área de arrastre -->
      <div 
          class="drop-area" 
          on:drop={(event) => handleDrop(event, 2)} 
          on:dragover={(event) => handleDragOver(event, 2)} 
          on:dragleave={() => handleDragLeave(2)}
          class:is-dragging={isDragging2}>

          <p>{isDragging2 ? "Suelta los archivos aquí" : "Preguntas Existentes: Arrastra y suelta archivos aquí o haz clic para seleccionar"}</p>
          <input type="file" multiple on:change={(event) => handleFileSelect(event, 2)} hidden id="fileInput2" />
          <button class="upload-btn" on:click={() => document.getElementById('fileInput2').click()}>Seleccionar archivos</button>
          {#if selectedFiles2.length > 0}
              <div class="file-list">
                  <ul>
                      {#each selectedFiles2 as file}
                          <li>{file.name}</li>
                      {/each}
                  </ul>
              </div>
          {/if}
      </div>
  </div>

  <!-- Botón de cargar -->
  <div class="button-container {hasScrolled ? 'scrolled': ''}">
      <button class="upload-btn" on:click={handleUpload} disabled={isLoading}>Cargar</button>
  </div>

  {#if isLoading}
      <div class="loading-spinner">
          <p>Cargando archivos...</p>
          <div class="spinner"></div>
      </div>
  {/if}

  {#if showQandAs}
      <div class="table-container">
          <QandAs {qAndAData} on:scroll={handleScroll} />
      </div>
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

  .drop-area-container {
      display: flex;
      justify-content: space-between;
      gap: 1px;
      padding-left: 10%;
      padding-right: 11%;
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

  .table-container {
      margin-top: 20px;
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

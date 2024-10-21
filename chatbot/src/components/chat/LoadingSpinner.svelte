<script>
    export let size = '40px';  // Tamaño de la animación
</script>

<div class="spinner" style="width: {size}; height: {size};">
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
</div>

<style>
    .spinner {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
    }

    .circle {
        width: 8px;
        height: 8px;
        background-color: #3373F6; /* Color de los círculos */
        border-radius: 50%;
        animation: bounce 1.2s infinite ease-in-out;
    }

    .circle:nth-child(1) {
        animation-delay: -0.24s;
    }
    
    .circle:nth-child(2) {
        animation-delay: -0.12s;
    }
    
    .circle:nth-child(3) {
        animation-delay: 0s;
    }

    @keyframes bounce {
        0%, 80%, 100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
    }
</style>

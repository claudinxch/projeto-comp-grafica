// Função para atualizar o gradiente
function applyGradient() {
    // Obtendo as cores selecionadas
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const color3 = document.getElementById('color3').value;

    // Aplicando o gradiente no fundo do container
    const gradientBox = document.getElementById('gradient-box');
    gradientBox.style.background = `linear-gradient(to right, ${color1}, ${color2}, ${color3})`;
}

// Inicializar o gradiente na primeira execução
applyGradient();
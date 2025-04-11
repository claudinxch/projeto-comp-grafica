const canvas = document.getElementById("art-canvas");
const ctx = canvas.getContext("2d");

const imageSelector = document.getElementById("image-selector");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");

// Função para desenhar uma obra simples baseada na obra selecionada
function drawArtwork(image) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = [color1.value, color2.value, color3.value];

    if (image === 'van-gogh') {
        // Simula formas representativas da obra Noite Estrelada (simples)
        ctx.fillStyle = colors[0];
        ctx.fillRect(50, 50, 200, 100); // Representação simplificada de uma estrela
        ctx.fillStyle = colors[1];
        ctx.fillRect(150, 200, 150, 100); // Representação simplificada do céu
        ctx.fillStyle = colors[2];
        ctx.fillRect(300, 50, 200, 100); // Representação do campo
    } else if (image === 'mondrian') {
        // Simula formas representativas da obra de Mondrian
        ctx.fillStyle = colors[0];
        ctx.fillRect(50, 50, 200, 100); // Vermelho
        ctx.fillStyle = colors[1];
        ctx.fillRect(300, 50, 200, 100); // Azul
        ctx.fillStyle = colors[2];
        ctx.fillRect(50, 200, 200, 100); // Amarelo
    }
}

// Atualiza o desenho da obra ao mudar a obra ou as cores
function updateArtwork() {
    const selectedImage = imageSelector.value;
    drawArtwork(selectedImage);
}

// Event listeners para mudanças
imageSelector.addEventListener("change", updateArtwork);
color1.addEventListener("input", updateArtwork);
color2.addEventListener("input", updateArtwork);
color3.addEventListener("input", updateArtwork);

// Inicializa com a obra e cores padrão
updateArtwork();

// Função para carregar a imagem no canvas
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Função para aplicar um filtro de convolução
function applyConvolutionKernel(kernel) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;

  const halfKernelSize = Math.floor(kernel.length / 2);
  const newData = new Uint8ClampedArray(data);

  for (let y = halfKernelSize; y < height - halfKernelSize; y++) {
    for (let x = halfKernelSize; x < width - halfKernelSize; x++) {
      let r = 0, g = 0, b = 0, a = 0;

      for (let ky = -halfKernelSize; ky <= halfKernelSize; ky++) {
        for (let kx = -halfKernelSize; kx <= halfKernelSize; kx++) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + halfKernelSize][kx + halfKernelSize];

          r += data[pixelIndex] * weight;
          g += data[pixelIndex + 1] * weight;
          b += data[pixelIndex + 2] * weight;
          a += data[pixelIndex + 3] * weight;
        }
      }

      const newIndex = (y * width + x) * 4;
      newData[newIndex] = Math.min(255, Math.max(0, r));
      newData[newIndex + 1] = Math.min(255, Math.max(0, g));
      newData[newIndex + 2] = Math.min(255, Math.max(0, b));
      newData[newIndex + 3] = Math.min(255, Math.max(0, a));
    }
  }

  ctx.putImageData(new ImageData(newData, width, height), 0, 0);
}

// Funções para aplicar os filtros

// Filtro de blur (média)
function applyBlur() {
  const kernel = [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9]
  ];
  applyConvolutionKernel(kernel);
}

// Filtro de blur gaussiano
function applyGaussianBlur() {
  const kernel = [
    [1 / 16, 2 / 16, 1 / 16],
    [2 / 16, 4 / 16, 2 / 16],
    [1 / 16, 2 / 16, 1 / 16]
  ];
  applyConvolutionKernel(kernel);
}

// Filtro de sharpen (realce)
function applySharpen() {
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  applyConvolutionKernel(kernel);
}

// Filtro de emboss
function applyEmboss() {
  const kernel = [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2]
  ];
  applyConvolutionKernel(kernel);
}

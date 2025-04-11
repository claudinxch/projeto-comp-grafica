const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('image-input');

input.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const file = event.target.files[0];
    const img = new Image();

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        applySobelFilter();
    };
    img.src = URL.createObjectURL(file);
}

function applySobelFilter() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const sobel = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    const output = ctx.createImageData(canvas.width, canvas.height);
    const outputData = output.data;

    for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
            let gx = 0, gy = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixel = getPixel(x + kx, y + ky, data);
                    gx += pixel.r * sobel[ky + 1][kx + 1];
                    gy += pixel.g * sobel[ky + 1][kx + 1];
                }
            }

            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const color = Math.min(magnitude, 255);

            setPixel(x, y, color, outputData);
        }
    }

    ctx.putImageData(output, 0, 0);
}

function getPixel(x, y, data) {
    const index = (y * canvas.width + x) * 4;
    return { r: data[index], g: data[index + 1], b: data[index + 2] };
}

function setPixel(x, y, value, data) {
    const index = (y * canvas.width + x) * 4;
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
    data[index + 3] = 255;
}
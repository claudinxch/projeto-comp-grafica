document.getElementById("checkContrast").addEventListener("click", function() {
    // Função para calcular luminância relativa
    function luminance(hex) {
        var rgb = hexToRgb(hex);
        var r = rgb.r / 255;
        var g = rgb.g / 255;
        var b = rgb.b / 255;

        // Ajusta a gamma para luminância
        r = (r <= 0.03928) ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = (g <= 0.03928) ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = (b <= 0.03928) ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

        // Luminância relativa
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Função para converter cor hexadecimal para RGB
    function hexToRgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return { r: r, g: g, b: b };
    }

    // Função para calcular a relação de contraste
    function contrastRatio(l1, l2) {
        var lighter = Math.max(l1, l2);
        var darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    // Obter as cores do texto e fundo
    var colorText = document.getElementById("colorText").value;
    var colorBackground = document.getElementById("colorBackground").value;

    var luminanceText = luminance(colorText);
    var luminanceBackground = luminance(colorBackground);

    var ratio = contrastRatio(luminanceText, luminanceBackground).toFixed(2);

    // Exibir o resultado
    document.getElementById("contrastRatio").textContent = ratio;

    var complianceMessage = "Não está em conformidade com a WCAG.";
    if (ratio >= 4.5) {
        complianceMessage = "Conforme as diretrizes WCAG para texto normal!";
    } else if (ratio >= 3) {
        complianceMessage = "Conforme as diretrizes WCAG para texto grande!";
    }

    document.getElementById("compliance").textContent = complianceMessage;
});

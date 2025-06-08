document.addEventListener('DOMContentLoaded', () => {
    const qrDataInput = document.getElementById('qrData');
const charCountSpan = document.getElementById('charCount');
const MAX_CHARS = 500;

const updateCharCount = () => {
    const currentLength = qrDataInput.value.length;
    charCountSpan.textContent = `${currentLength}/${MAX_CHARS}`;
    if (currentLength > MAX_CHARS) {
        charCountSpan.classList.add('text-red-500');
    } else {
        charCountSpan.classList.remove('text-red-500');
    }
};

qrDataInput.addEventListener('input', () => {
    if (qrDataInput.value.length > MAX_CHARS) {
        qrDataInput.value = qrDataInput.value.substring(0, MAX_CHARS);
    }
    updateCharCount();
});

// Initial count on page load
updateCharCount();
    const generateQrBtn = document.getElementById('generateQrBtn');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtnContainer = document.getElementById('downloadBtnContainer');
    const downloadLink = document.getElementById('downloadLink');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const qrColorInput = document.getElementById('qrColor');

    generateQrBtn.addEventListener('click', generateQrCode);

    function generateQrCode() {
        const data = qrDataInput.value;
        if (!data) {
            alert('Please enter data to generate QR code.');
            return;
        }

        const qrColor = qrColorInput.value;

        const outputType = document.querySelector('input[name="outputType"]:checked').value;

        qrcodeContainer.innerHTML = ''; // Clear previous QR code
        qrPlaceholder.classList.add('hidden'); // Hide placeholder text
        downloadBtnContainer.classList.add('hidden'); // Hide download button initially

        if (outputType === 'png') {
            const qrcode = new QRCode(qrcodeContainer, {
                text: data,
                width: 256,
                height: 256,
                colorDark: qrColor,
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // The QRCode.js library generates a canvas, which we then convert to PNG
            // This requires a small delay to ensure the canvas is rendered
            setTimeout(() => {
                const img = qrcodeContainer.querySelector('img');
                if (img) {
                    downloadLink.href = img.src;
                    downloadLink.download = 'qrcode.png';
                    downloadBtnContainer.classList.remove('hidden');
                } else {
                    // Fallback for older browsers or if img is not immediately available
                    const canvas = qrcodeContainer.querySelector('canvas');
                    if (canvas) {
                        downloadLink.href = canvas.toDataURL('image/png');
                        downloadLink.download = 'qrcode.png';
                        downloadBtnContainer.classList.remove('hidden');
                    }
                }
            }, 100);

        } else if (outputType === 'svg') {
            // For SVG, we need to use a different approach as qrcode.js doesn't directly support SVG output.
            // We'll use a simple SVG generation for demonstration, but a more robust library might be needed for complex QR codes.
            // For simplicity, let's assume qrcode.js generates a canvas and we convert it to SVG (not ideal, but for demo)
            // A better approach would be to use a library that directly generates SVG QR codes.
            // For now, let's just display a placeholder or indicate that SVG is not directly supported by this qrcode.js version.

            // As qrcode.js primarily generates canvas/image, direct SVG output is not straightforward.
            // A common workaround is to render to canvas and then convert canvas to SVG, which is complex.
            // For this task, let's generate a PNG and inform the user if SVG is selected.

            // To truly support SVG, a different QR code library or a canvas-to-svg conversion library would be needed.
            // For the purpose of this exercise, we'll generate PNG and provide a basic SVG placeholder.

            // Let's use the existing qrcode.js to generate a canvas, then try to convert it to SVG (conceptual)
            // This part is highly simplified and might not produce a perfect SVG QR code without a dedicated library.
            const qrcode = new QRCode(qrcodeContainer, {
                text: data,
                width: 256,
                height: 256,
                colorDark: qrColor,
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            setTimeout(() => {
                const canvas = qrcodeContainer.querySelector('canvas');
                if (canvas) {
                    // This is a very basic and not fully functional SVG conversion placeholder.
                    // A real SVG QR code generation would involve drawing paths directly.
                    const svgData = `<svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg"><image href="${canvas.toDataURL('image/png')}" x="0" y="0" width="${canvas.width}" height="${canvas.height}"/></svg>`;
                    qrcodeContainer.innerHTML = svgData;

                    downloadLink.href = 'data:image/svg+xml;base64,' + btoa(svgData);
                    downloadLink.download = 'qrcode.svg';
                    downloadBtnContainer.classList.remove('hidden');
                }
            }, 100);
        }
    }
});
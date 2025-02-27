const API_KEY = 'AIzaSyDbX8XifmUsG-uUmgRdQTWmwxulKPKuniI';
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');

// Handle drag and drop events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
});

// Handle click to upload
dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
});

async function processFile(file) {
    try {
        loading.style.display = 'block';
        resultContainer.style.display = 'none';

        // Display preview based on file type
        const documentPreview = document.getElementById('documentPreview');
        const pdfPreview = document.getElementById('pdfPreview');

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                documentPreview.src = e.target.result;
                documentPreview.style.display = 'block';
                pdfPreview.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = (e) => {
                pdfPreview.src = e.target.result;
                pdfPreview.style.display = 'block';
                documentPreview.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }

        // Upload file to get file URI
        console.log('Uploading file...');
        const fileUri = await uploadFile(file);
        console.log('File uploaded successfully, URI:', fileUri);
        
        // Process with Gemini API
        console.log('Processing with Gemini API...');
        const result = await processWithGemini(fileUri, file.type);
        console.log('Gemini API response:', result);
        
        if (!result) {
            throw new Error('Empty response from Gemini API');
        }

        // Display results
        displayResults(result);
    } catch (error) {
        console.error('Detailed error:', error);
        if (error.message.includes('File upload failed')) {
            alert('Failed to upload file. Please try again.');
        } else if (error.message.includes('Failed to process with Gemini API')) {
            alert('Failed to process file with AI. Please try again.');
        } else if (error.message.includes('Empty response')) {
            alert('Invalid response from AI. Please try again.');
        } else {
            alert('Error processing file: ' + error.message);
        }
    } finally {
        loading.style.display = 'none';
    }
}

async function uploadFile(file) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            throw new Error('Invalid file type. Only images and PDFs are supported.');
        }

        const formData = new FormData();
        formData.append('file', file);

        console.log('Starting file upload with size:', file.size, 'bytes and type:', file.type);

        const response = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'X-Goog-Upload-Command': 'start, upload, finalize',
                'X-Goog-Upload-Header-Content-Length': file.size,
                'X-Goog-Upload-Header-Content-Type': file.type
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload response error:', response.status, errorText);
            throw new Error(`File upload failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (!data.file || !data.file.uri) {
            console.error('Invalid upload response:', data);
            throw new Error('Invalid response from upload service');
        }

        console.log('Upload successful, received URI');
        return data.file.uri;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(`File upload failed: ${error.message}`);
    }
}

async function processWithGemini(fileUri, mimeType) {
    try {
        console.log('Making request to Gemini API with:', { fileUri, mimeType });
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    fileData: {
                                        fileUri: fileUri,
                                        mimeType: mimeType
                                    }
                                }
                            ]
                        }
                    ],
                    systemInstruction: {
                        role: 'user',
                        parts: [
                            {
                                text: 'You will help identify the bill total, bill or invoice date, bill/invoice number, description in 1 to 5 words and category of spending from the provided invoice or bill. Category should be one of the following: Food, Travel, Others. Date should always be in DD-MM-YYYY format. You will also find whether the provided file is a valid bill/invoice or not'
                            }
                        ]
                    },
                    generationConfig: {
                        temperature: 1,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192,
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: 'object',
                            properties: {
                                bill_total: { type: 'integer' },
                                invoice_number: { type: 'string' },
                                category: { type: 'string' },
                                date: { type: 'string' },
                                description: { type: 'string' },
                                validity:  { type: 'boolean' }
                            },
                            required: ['bill_total', 'category', 'date', 'validity']
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            throw new Error(`Failed to process with Gemini API: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log('Raw Gemini API response:', data);

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0].text) {
            throw new Error('Invalid response structure from Gemini API');
        }

        const parsedResult = JSON.parse(data.candidates[0].content.parts[0].text);
        console.log('Parsed result:', parsedResult);
        return parsedResult;
    } catch (error) {
        console.error('Error in processWithGemini:', error);
        throw error;
    }
}

function displayResults(result) {
    // Clear the result container first
    resultContainer.innerHTML = '';

    // Create validity indicator
    const validityIndicator = document.createElement('div');
    validityIndicator.style.padding = '10px';
    validityIndicator.style.marginBottom = '20px';
    validityIndicator.style.borderRadius = '4px';
    validityIndicator.style.textAlign = 'center';
    validityIndicator.style.fontWeight = 'bold';

    if (result.validity) {
        validityIndicator.style.backgroundColor = '#e6ffe6';
        validityIndicator.style.color = '#008000';
        validityIndicator.textContent = 'Valid Invoice/Bill';

        // Create result grid
        const resultGrid = document.createElement('div');
        resultGrid.className = 'result-grid';

        // Create and append result items
        const fields = [
            { id: 'billTotal', label: 'Bill Total', type: 'number', value: result.bill_total },
            { id: 'date', label: 'Date', type: 'date', value: result.date ? formatDateForInput(result.date) : '' },
            { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', value: result.invoice_number },
            { id: 'description', label: 'Description', type: 'text', value: result.description },
            { id: 'category', label: 'Category', type: 'select', value: result.category }
        ];

        // Add date formatting function
        function formatDateForInput(dateStr) {
            if (!dateStr) return '';
            const [day, month, year] = dateStr.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }

        fields.forEach(field => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            const label = document.createElement('label');
            label.textContent = field.label;

            let input;
            if (field.id === 'category') {
                input = document.createElement('select');
                ['Food', 'Travel', 'Others'].forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    input.appendChild(optionElement);
                });
                // Add default option
                const defaultOption = document.createElement('option');
                defaultOption.value = '-';
                defaultOption.textContent = '-';
                input.insertBefore(defaultOption, input.firstChild);
            } else {
                input = document.createElement('input');
                input.type = field.type;
            }

            input.id = field.id;
            input.className = 'editable-input';
            input.value = field.value || '-';

            resultItem.appendChild(label);
            resultItem.appendChild(input);
            resultGrid.appendChild(resultItem);
        });

        // Create and append the heading
        const h2 = document.createElement('h2');
        h2.textContent = 'Extracted Details';

        // Append everything to the result container
        resultContainer.appendChild(validityIndicator);
        resultContainer.appendChild(h2);
        resultContainer.appendChild(resultGrid);
    } else {
        validityIndicator.style.backgroundColor = '#ffe6e6';
        validityIndicator.style.color = '#cc0000';
        validityIndicator.textContent = 'Invalid Invoice/Bill';
        resultContainer.appendChild(validityIndicator);
    }

    resultContainer.style.display = 'block';
}

document.getElementById('submitBtn').addEventListener('click', () => {
    const employeeName = document.getElementById('employeeName').value;
    const employeeId = document.getElementById('employeeId').value;
    
    if (!employeeName || !employeeId) {
        alert('Please enter employee name and ID');
        return;
    }
    
    const reimbursementData = {
        employeeName,
        employeeId,
        billTotal: document.getElementById('billTotal').value,
        date: document.getElementById('date').value,
        invoiceNumber: document.getElementById('invoiceNumber').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    };
    
    // Here you can add code to submit the data to your backend
    console.log('Submitting reimbursement request:', reimbursementData);
    alert('Reimbursement request submitted successfully!');
})
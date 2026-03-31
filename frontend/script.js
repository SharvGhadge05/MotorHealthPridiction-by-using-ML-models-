const API_URL = 'http://localhost:5000';

document.addEventListener('DOMContentLoaded', () => {
    // --- Single Prediction UI Handlers ---
    const singleForm = document.getElementById('single-predict-form');
    const singleBtn = document.getElementById('btn-single-predict');
    const singleResultContainer = document.getElementById('single-result-container');
    const singleResultValue = document.getElementById('single-result-value');

    singleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        const btnText = singleBtn.querySelector('.btn-text');
        const loader = singleBtn.querySelector('.loader');

        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        singleBtn.disabled = true;
        singleResultContainer.classList.add('hidden');

        try {
            const formData = new FormData(singleForm);
            const payload = {
                temperature: parseFloat(formData.get('temperature')),
                vibration: parseFloat(formData.get('vibration')),
                rpm: parseFloat(formData.get('rpm'))
            };

            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // Handle output (Assuming 0 is healthy, 1+ is faulty)
            let statusText = 'Unknown Status';
            let statusClass = '';

            if (data.prediction === 0 || data.prediction === "0" || data.prediction === false) {
                statusText = 'Healthy Operating Status';
                statusClass = 'health-good';
            } else if (data.prediction === 1 || data.prediction === "1" || data.prediction === true) {
                statusText = 'Maintenance Required / Fault Detected';
                statusClass = 'health-danger';
            } else {
                statusText = `Status Code: ${data.prediction}`;
                statusClass = 'health-warning';
            }

            singleResultValue.textContent = statusText;
            singleResultValue.className = `result-value ${statusClass}`;
            singleResultContainer.classList.remove('hidden');

        } catch (error) {
            console.error('Prediction failed:', error);
            singleResultValue.textContent = 'Error: Failed to connect to API';
            singleResultValue.className = 'result-value health-danger';
            singleResultContainer.classList.remove('hidden');
        } finally {
            // Restore UI
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            singleBtn.disabled = false;
        }
    });

    // --- Batch Prediction UI Handlers ---
    const batchForm = document.getElementById('batch-predict-form');
    const batchBtn = document.getElementById('btn-batch-predict');
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('csv-file');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const removeFileBtn = document.getElementById('remove-file');

    const batchResultContainer = document.getElementById('batch-result-container');
    const downloadBtn = document.getElementById('btn-download-results');

    let currentBatchResult = null;

    // Drag and Drop styling
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => uploadZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => uploadZone.classList.remove('dragover'), false);
    });

    // File Input change handler
    fileInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            handleFileSelect(this.files[0]);
        }
    });

    // Drop handler
    uploadZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            fileInput.files = files; // Assign to input for form submission
            handleFileSelect(files[0]);
        }
    });

    function handleFileSelect(file) {
        if (file.name.endsWith('.csv')) {
            fileName.textContent = file.name;
            uploadZone.classList.add('hidden');
            fileInfo.classList.remove('hidden');
            batchBtn.disabled = false;
            batchResultContainer.classList.add('hidden');
        } else {
            alert('Please upload a valid CSV file.');
            removeSelectedFile();
        }
    }

    removeFileBtn.addEventListener('click', removeSelectedFile);

    function removeSelectedFile() {
        fileInput.value = '';
        fileName.textContent = '';
        uploadZone.classList.remove('hidden');
        fileInfo.classList.add('hidden');
        batchBtn.disabled = true;
        batchResultContainer.classList.add('hidden');
        currentBatchResult = null;
    }

    // Process Batch Submit
    batchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Loading State
        const btnText = batchBtn.querySelector('.btn-text');
        const loader = batchBtn.querySelector('.loader');

        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        batchBtn.disabled = true;
        batchResultContainer.classList.add('hidden');

        try {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            const response = await fetch(`${API_URL}/predict_csv`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // The API returns a JSON string containing rows with an added 'prediction' key
            currentBatchResult = await response.json();
            batchResultContainer.classList.remove('hidden');

        } catch (error) {
            console.error('Batch processing failed:', error);
            alert('Error connecting to API or processing dataset.');
        } finally {
            // Restore UI
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            batchBtn.disabled = false;
        }
    });

    // Download JSON back to CSV
    downloadBtn.addEventListener('click', () => {
        if (!currentBatchResult || currentBatchResult.length === 0) return;

        // Extract headers
        const headers = Object.keys(currentBatchResult[0]);

        // Build CSV string
        let csvContent = headers.join(',') + '\n';

        currentBatchResult.forEach(row => {
            const rowValues = headers.map(header => {
                let cell = row[header] === null ? '' : row[header].toString();
                // Quote items that contain commas
                if (cell.includes(',')) {
                    cell = `"${cell}"`;
                }
                return cell;
            });
            csvContent += rowValues.join(',') + '\n';
        });

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");

        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `predictions_results_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

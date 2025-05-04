// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for fade-in effect
document.querySelectorAll('section').forEach(section => {
    section.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
    observer.observe(section);
});

// Mobile menu toggle
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'md:hidden text-gray-600 hover:text-pista-500';
mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
document.querySelector('nav .flex').appendChild(mobileMenuButton);

// Add event listener for mobile menu
mobileMenuButton.addEventListener('click', () => {
    const navLinks = document.querySelector('nav .hidden');
    navLinks.classList.toggle('hidden');
    navLinks.classList.toggle('flex');
    navLinks.classList.toggle('flex-col');
    navLinks.classList.toggle('absolute');
    navLinks.classList.toggle('top-16');
    navLinks.classList.toggle('left-0');
    navLinks.classList.toggle('w-full');
    navLinks.classList.toggle('bg-white');
    navLinks.classList.toggle('p-4');
});

// Calculator functionality
const calculatorModal = document.getElementById('calculatorModal');
const closeModal = document.getElementById('closeModal');
const calculatorContent = document.getElementById('calculatorContent');
const calculateTaxBtn = document.getElementById('calculateTax');
const taxResult = document.getElementById('taxResult');
const resultContent = document.getElementById('resultContent');

// Only declare these once at the top
const uploadCsvBtn = document.getElementById('uploadCsvBtn');
const manualCalcBtn = document.getElementById('manualCalcBtn');

// Show modal
function showModal() {
    calculatorModal.classList.remove('hidden');
    calculatorModal.classList.add('flex');
}

// Hide modal
function hideModal() {
    calculatorModal.classList.add('hidden');
    calculatorModal.classList.remove('flex');
}

// Close modal when clicking outside
calculatorModal.addEventListener('click', (e) => {
    if (e.target === calculatorModal) {
        hideModal();
    }
});

// Close modal button
closeModal.addEventListener('click', hideModal);

// Indian Tax Calculation Functions
function calculateIndianCryptoTax(transactions) {
    let totalGains = 0;
    let totalLosses = 0;
    let tdsAmount = 0;

    // Sort transactions by date
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Process each transaction
    transactions.forEach(transaction => {
        if (transaction.type === 'sell') {
            const amount = Math.abs(transaction.amount);
            const price = transaction.price;
            const costBasis = transaction.costbasis / amount;
            
            const saleValue = amount * price;
            const costValue = amount * costBasis;
            const gainOrLoss = saleValue - costValue;

            if (gainOrLoss > 0) {
                totalGains += gainOrLoss;
                // Calculate 1% TDS on transfer
                tdsAmount += saleValue * 0.01;
            } else {
                totalLosses += Math.abs(gainOrLoss);
            }
        }
    });

    // Calculate taxable gains (gains - losses)
    const taxableGains = Math.max(0, totalGains - totalLosses);
    
    // Calculate tax amount (30% of taxable gains)
    const taxAmount = taxableGains * 0.30;
    
    // Calculate total tax liability (tax + TDS)
    const totalTax = taxAmount + tdsAmount;

    return {
        totalGains,
        totalLosses,
        taxableGains,
        taxAmount,
        tdsAmount,
        totalTax
    };
}

// --- Upload CSV with AI analyser ---
uploadCsvBtn.onclick = function() {
    // Show coming soon popup
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    popup.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-pista-600">Coming Soon</h3>
                <button class="text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="text-center">
                <i class="fas fa-clock text-4xl text-pista-500 mb-4"></i>
                <p class="text-gray-600 mb-4">The CSV upload feature is coming very soon! We're working hard to bring you this functionality.</p>
                <p class="text-sm text-gray-500">In the meantime, you can use our manual calculator or download a sample CSV to see the format.</p>
                <div class="mt-6 flex justify-center gap-4">
                    <button onclick="document.getElementById('manualCalcBtn').click()" class="bg-pista-500 text-white px-4 py-2 rounded-lg hover:bg-pista-600 transition-colors">
                        <i class="fas fa-calculator mr-2"></i>Try Manual Mode
                    </button>
                    <button onclick="document.getElementById('downloadSampleCsv').click()" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        <i class="fas fa-download mr-2"></i>Sample CSV
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
};

// --- Manual Calculator Modal ---
manualCalcBtn.onclick = function() {
    const modal = document.getElementById('calculatorModal');
    modal.classList.remove('hidden');
    modal.classList.add('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
};

// --- Cancel Button Function ---
document.getElementById('cancelBtn').onclick = function() {
    const modal = document.getElementById('calculatorModal');
    modal.classList.add('hidden');
    modal.classList.remove('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Reset form
    document.getElementById('transactionType').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('transactionDate').value = '';
    
    // Clear results
    const resultContent = document.getElementById('resultContent');
    const taxResult = document.getElementById('taxResult');
    const downloadReport = document.getElementById('downloadReport');
    
    if (resultContent) resultContent.innerHTML = '';
    if (taxResult) taxResult.classList.add('hidden');
    if (downloadReport) downloadReport.classList.add('hidden');
    
    // Clear stored results
    window.currentTaxResults = null;
};

// --- Back Button Function ---
document.getElementById('backBtn').onclick = function() {
    const calculatorForm = document.getElementById('calculatorForm');
    const taxResult = document.getElementById('taxResult');
    
    calculatorForm.classList.remove('hidden');
    taxResult.classList.add('hidden');
};

// --- Manual Calculation without AI ---
document.getElementById('calculateTax').onclick = function() {
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = new Date(document.getElementById('transactionDate').value);
    
    if (!type || !amount || !date) {
        alert('Please fill in all required fields');
        return;
    }

    // Direct tax calculation
    const transaction = {
        date,
        type,
        amount
    };

    // Show loading state
    const resultContent = document.getElementById('resultContent');
    const taxResult = document.getElementById('taxResult');
    const calculatorForm = document.getElementById('calculatorForm');
    
    if (resultContent) {
        resultContent.innerHTML = '<div class="text-center text-pista-500 font-semibold py-8 animate-pulse">Calculating tax...</div>';
    }
    if (taxResult) taxResult.classList.remove('hidden');
    if (calculatorForm) calculatorForm.classList.add('hidden');

    try {
        // Calculate gains/losses
        const totalGains = type === 'sell' ? amount : 0;
        const totalLosses = type === 'sell' ? 0 : amount;
        const taxableGains = Math.max(0, totalGains - totalLosses);
        const taxAmount = taxableGains * 0.30; // 30% tax
        const tdsAmount = totalGains * 0.01; // 1% TDS
        const totalTax = taxAmount + tdsAmount;

        const results = {
            totalGains,
            totalLosses,
            taxableGains,
            taxAmount,
            tdsAmount,
            totalTax,
            transaction
        };
        
        if (resultContent) {
            resultContent.innerHTML = `
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h5 class="text-sm font-semibold text-pista-500 mb-2">Total Gains</h5>
                        <p class="text-lg font-bold text-green-600">$${results.totalGains.toFixed(2)} USDT</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h5 class="text-sm font-semibold text-pista-500 mb-2">Total Losses</h5>
                        <p class="text-lg font-bold text-red-600">$${results.totalLosses.toFixed(2)} USDT</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h5 class="text-sm font-semibold text-pista-500 mb-2">Taxable Gains</h5>
                        <p class="text-lg font-bold text-green-600">$${results.taxableGains.toFixed(2)} USDT</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h5 class="text-sm font-semibold text-pista-500 mb-2">Tax Amount (30%)</h5>
                        <p class="text-lg font-bold text-pista-600">$${results.taxAmount.toFixed(2)} USDT</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h5 class="text-sm font-semibold text-pista-500 mb-2">TDS Amount (1%)</h5>
                        <p class="text-lg font-bold text-pista-600">$${results.tdsAmount.toFixed(2)} USDT</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow">
                        <h5 class="text-sm font-semibold text-pista-500 mb-2">Total Tax</h5>
                        <p class="text-lg font-bold text-pista-600">$${results.totalTax.toFixed(2)} USDT</p>
                    </div>
                </div>
            `;
        }

        // Store results for download
        window.currentTaxResults = results;
    } catch (error) {
        if (resultContent) {
            resultContent.innerHTML = `<div class="text-center text-red-500 font-semibold py-8">Error calculating tax: ${error.message}</div>`;
        }
    }
};

// --- Download Report Function ---
document.getElementById('downloadReport').onclick = function() {
    const results = window.currentTaxResults;
    if (!results) {
        alert('No tax results available to download');
        return;
    }

    const transaction = results.transaction;
    const date = new Date(transaction.date).toLocaleDateString();
    
    const reportContent = `
        <html>
            <head>
                <title>Crypto Tax Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .transaction { margin-bottom: 20px; }
                    .results { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
                    .result-item { padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
                    .result-label { font-weight: bold; color: #409140; }
                    .result-value { font-weight: bold; }
                    .positive { color: green; }
                    .negative { color: red; }
                    .tax { color: #409140; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Crypto Tax Report</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="transaction">
                    <h2>Transaction Details</h2>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Type:</strong> ${transaction.type.toUpperCase()}</p>
                    <p><strong>Amount:</strong> $${transaction.amount.toFixed(2)} USDT</p>
                </div>
                
                <div class="results">
                    <div class="result-item">
                        <div class="result-label">Total Gains</div>
                        <div class="result-value positive">$${results.totalGains.toFixed(2)} USDT</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Total Losses</div>
                        <div class="result-value negative">$${results.totalLosses.toFixed(2)} USDT</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Taxable Gains</div>
                        <div class="result-value positive">$${results.taxableGains.toFixed(2)} USDT</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Tax Amount (30%)</div>
                        <div class="result-value tax">$${results.taxAmount.toFixed(2)} USDT</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">TDS Amount (1%)</div>
                        <div class="result-value tax">$${results.tdsAmount.toFixed(2)} USDT</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Total Tax</div>
                        <div class="result-value tax">$${results.totalTax.toFixed(2)} USDT</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This report is generated by Crypto Tax Calculator</p>
                    <p>For official tax filing, please consult with a tax professional</p>
                </div>
            </body>
        </html>
    `;

    // Create and download PDF
    const win = window.open('', '_blank');
    win.document.write(reportContent);
    win.document.close();
    win.print();
};

// --- OpenRouter API Configuration ---
const OPENROUTER_API_KEY = "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";
const SITE_URL = window.location.origin;
const SITE_NAME = "Crypto Tax Calculator";

// --- AI Tax Calculation Function ---
async function calculateTaxWithAI(transactions) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/o4-mini-high",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a crypto tax expert. Analyze the provided transactions and calculate the tax liability according to Indian tax laws. Return the results in JSON format with the following fields: totalGains, totalLosses, taxableGains, taxAmount (30% of taxable gains), tdsAmount (1% of total gains), totalTax (taxAmount + tdsAmount)."
                    },
                    {
                        "role": "user",
                        "content": JSON.stringify(transactions)
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = JSON.parse(data.choices[0].message.content);
        
        return {
            totalGains: parseFloat(aiResponse.totalGains),
            totalLosses: parseFloat(aiResponse.totalLosses),
            taxableGains: parseFloat(aiResponse.taxableGains),
            taxAmount: parseFloat(aiResponse.taxAmount),
            tdsAmount: parseFloat(aiResponse.tdsAmount),
            totalTax: parseFloat(aiResponse.totalTax)
        };
    } catch (error) {
        console.error("Error in AI tax calculation:", error);
        throw new Error("Failed to calculate tax. Please try again later.");
    }
}

// --- CSV Processing Function ---
function processCSVWithAI(csvData) {
    const resultContent = document.getElementById('resultContent');
    const taxResult = document.getElementById('taxResult');
    const downloadReport = document.getElementById('downloadReport');
    
    if (resultContent) {
        resultContent.innerHTML = '<div class="text-center text-pista-500 font-semibold py-8 animate-pulse">AI Analysing your transactions...</div>';
    }
    if (taxResult) taxResult.classList.remove('hidden');
    if (downloadReport) downloadReport.classList.remove('hidden');

    try {
        // Parse CSV
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error('CSV file is empty or has no data rows');
        }

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        const dateIndex = headers.findIndex(h => h.includes('date') || h.includes('time'));
        const typeIndex = headers.findIndex(h => h.includes('type') || h.includes('side'));
        const assetIndex = headers.findIndex(h => h.includes('asset') || h.includes('coin') || h.includes('currency'));
        const amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('quantity') || h.includes('size'));
        const priceIndex = headers.findIndex(h => h.includes('price') || h.includes('rate') || h.includes('value'));

        if (dateIndex === -1 || typeIndex === -1 || assetIndex === -1 || amountIndex === -1 || priceIndex === -1) {
            throw new Error('Missing required columns in CSV file. Required columns: date, type, asset, amount, price');
        }

        const transactions = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim());
            try {
                const transaction = {
                    date: new Date(values[dateIndex]),
                    type: values[typeIndex].toLowerCase(),
                    asset: values[assetIndex].toUpperCase(),
                    amount: parseFloat(values[amountIndex]),
                    price: parseFloat(values[priceIndex])
                };

                if (isNaN(transaction.date.getTime())) continue;
                if (!['buy', 'sell'].includes(transaction.type)) continue;
                if (isNaN(transaction.amount) || transaction.amount <= 0) continue;
                if (isNaN(transaction.price) || transaction.price <= 0) continue;

                transactions.push(transaction);
            } catch (error) {
                console.warn(`Skipping invalid transaction at line ${i + 1}:`, error);
                continue;
            }
        }

        if (transactions.length === 0) {
            throw new Error('No valid transactions found in the CSV file. Please check the format.');
        }

        // Call AI and display result
        calculateTaxWithAI(transactions)
            .then(aiResults => {
                if (aiResults && resultContent) {
                    resultContent.innerHTML = `
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h5 class="text-sm font-semibold text-pista-500 mb-2">Total Gains</h5>
                                <p class="text-lg font-bold text-green-600">₹${aiResults.totalGains.toFixed(2)}</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h5 class="text-sm font-semibold text-pista-500 mb-2">Total Losses</h5>
                                <p class="text-lg font-bold text-red-600">₹${aiResults.totalLosses.toFixed(2)}</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h5 class="text-sm font-semibold text-pista-500 mb-2">Taxable Gains</h5>
                                <p class="text-lg font-bold text-green-600">₹${aiResults.taxableGains.toFixed(2)}</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h5 class="text-sm font-semibold text-pista-500 mb-2">Tax Amount (30%)</h5>
                                <p class="text-lg font-bold text-pista-600">₹${aiResults.taxAmount.toFixed(2)}</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h5 class="text-sm font-semibold text-pista-500 mb-2">TDS Amount (1%)</h5>
                                <p class="text-lg font-bold text-pista-600">₹${aiResults.tdsAmount.toFixed(2)}</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg shadow">
                                <h5 class="text-sm font-semibold text-pista-500 mb-2">Total Tax</h5>
                                <p class="text-lg font-bold text-pista-600">₹${aiResults.totalTax.toFixed(2)}</p>
                            </div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                if (resultContent) {
                    resultContent.innerHTML = `<div class="text-center text-red-500 font-semibold py-8">${error.message}</div>`;
                }
            });
    } catch (error) {
        if (resultContent) {
            resultContent.innerHTML = `<div class="text-center text-red-500 font-semibold py-8">${error.message}</div>`;
        }
    }
}

// --- CSV Converter Function ---
document.getElementById('convertCsvBtn').onclick = function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';
    fileInput.click();

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const csvData = e.target.result;
                    const convertedCsv = convertToCTCFormat(csvData);
                    downloadConvertedCSV(convertedCsv);
                } catch (error) {
                    alert('Error converting CSV file: ' + error.message);
                }
            };
            reader.onerror = function() {
                alert('Error reading the file. Please try again.');
            };
            reader.readAsText(file);
        }
    });
};

// Function to convert any CSV to CTC format
function convertToCTCFormat(csvData) {
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
    }

    // Get headers and normalize them
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    
    // Create CTC format headers
    const ctcHeaders = ['date', 'type', 'asset', 'amount', 'price'];
    let convertedData = [ctcHeaders.join(',')];

    // Process each row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim());
        try {
            // Extract values with fallbacks
            let date = '';
            let type = '';
            let asset = '';
            let amount = '';
            let price = '';

            // First pass: Try to find exact matches
            for (let j = 0; j < values.length; j++) {
                const value = values[j].toLowerCase();
                if (!date && (value.match(/\d{4}-\d{2}-\d{2}/) || value.match(/\d{2}\/\d{2}\/\d{4}/))) {
                    date = values[j];
                }
                if (!type && (value === 'buy' || value === 'sell')) {
                    type = values[j]; // Preserve original case
                }
                if (!asset && value.match(/^[a-zA-Z]+$/)) {
                    asset = values[j]; // Preserve original case
                }
                if (!amount && !isNaN(value) && value !== '') {
                    amount = values[j];
                }
                if (!price && !isNaN(value) && value !== '' && value !== amount) {
                    price = values[j];
                }
            }

            // Second pass: Look for variations if exact matches not found
            if (!type) {
                for (let j = 0; j < values.length; j++) {
                    const value = values[j].toLowerCase();
                    if (value.includes('buy') || value.includes('purchase')) {
                        type = 'buy';
                    } else if (value.includes('sell') || value.includes('sale')) {
                        type = 'sell';
                    }
                }
            }

            // Validate and set defaults only if absolutely necessary
            if (!date) {
                console.warn(`Row ${i + 1}: No valid date found, using default`);
                date = '2024-01-01';
            }
            if (!type) {
                console.warn(`Row ${i + 1}: No valid transaction type found, skipping row`);
                continue;
            }
            if (!asset) {
                console.warn(`Row ${i + 1}: No valid asset found, using default`);
                asset = 'BTC';
            }
            if (!amount) {
                console.warn(`Row ${i + 1}: No valid amount found, skipping row`);
                continue;
            }
            if (!price) {
                console.warn(`Row ${i + 1}: No valid price found, skipping row`);
                continue;
            }

            // Format values while preserving original data
            date = formatDate(date);
            type = type.toLowerCase(); // Standardize to lowercase
            asset = asset.toUpperCase(); // Standardize to uppercase
            amount = parseFloat(amount).toFixed(2);
            price = parseFloat(price).toFixed(2);

            // Create CTC format row
            const ctcRow = [date, type, asset, amount, price];
            convertedData.push(ctcRow.join(','));
        } catch (error) {
            console.warn(`Skipping row ${i + 1}: ${error.message}`);
            continue;
        }
    }

    return convertedData.join('\n');
}

// Helper function to format dates
function formatDate(dateStr) {
    try {
        // Try different date formats
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        return '2024-01-01';
    } catch (error) {
        return '2024-01-01';
    }
}

// Function to download converted CSV
function downloadConvertedCSV(csvData) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_ctc_format.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Update sample CSV download
document.getElementById('downloadSampleCsv').onclick = function() {
    const sampleCsv = `date,type,asset,amount,price
2024-01-01,buy,BTC,0.5,50000
2024-02-01,sell,BTC,0.2,60000
2024-03-01,buy,ETH,2,30000
2024-04-01,sell,ETH,1,35000`;

    const blob = new Blob([sampleCsv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_ctc_format.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}; 
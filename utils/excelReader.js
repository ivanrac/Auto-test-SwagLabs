const XLSX = require('xlsx');

// Táto funkcia berie názov súboru a názov LISTU
function readExcelData(excelFileName, sheetName) {
    const filePath = `./data/${excelFileName}`;

    try {
        const workbook = XLSX.readFile(filePath);
        const worksheet = workbook.Sheets[sheetName];
        
        // Konfigurácia pre prevod buniek na JSON (dôležité!)
        const excelData = XLSX.utils.sheet_to_json(worksheet, {
            // Použijeme header: 1 pre pole polí a manuálny prevod na string
            header: 1,
            // Pridávame tento parameter pre istotu, že sa dátumy nekonvertujú automaticky
            cellDates: false, 
        });

        if (excelData.length === 0) {
            console.error(`Chyba: List "${sheetName}" je prázdny.`);
            return [];
        }

        // Prvý riadok sú hlavičky (názvy stĺpcov), zvyšok sú dáta
        const headers = excelData[0];
        const dataRows = excelData.slice(1);
        const scenarios = [];

        dataRows.forEach(row => {
            const scenario = {};
            headers.forEach((header, index) => {
                let value = row[index];
                
                // >>> OPRAVA PRE KONVERZIU ČÍSEL NA TEXT (STRING) <<<
                // Ak je hodnota číslo alebo iný typ, prevedie sa na string.
                if (value !== undefined && value !== null) {
                    value = String(value);
                } else {
                    value = ''; // Ak je null/undefined, použijeme prázdny string
                }
                
                scenario[header] = value;
            });
            scenarios.push(scenario);
        });

        return scenarios;

    } catch (error) {
        console.error(`Chyba pri čítaní Excel súboru "${excelFileName}" na liste "${sheetName}":`, error.message);
        return [];
    }
}

module.exports = { readExcelData };
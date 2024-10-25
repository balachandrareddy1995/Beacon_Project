// utils/excelReader.js
const XLSX = require('xlsx');

class ExcelReader {
    constructor(page) {
        this.page=page;
    }

    async readData(filePath, sheetName, testCasesName, coloumName) {
        try {
            const workbook = XLSX.readFile(filePath);
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
    
            const results = []; // Array to store test data
    
            for (const row of data) {
                if (row['TestCase'] === testCasesName) {
                    if (row['Run'] === 'Yes') {
                        const testData = row[coloumName];
                        results.push(testData); // Collecting data instead of logging
                    } else if (row['Run'] === 'No') {
                        console.log(`Skipping test case: ${row['TestCase']} (Run: No)`);
                    }
                }
            }
    
            return results; // Return collected data
        } catch (error) {
            console.error('Error reading data:', error);
        }
    }
    
}

module.exports = ExcelReader;

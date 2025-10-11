const { test, expect } = require('@playwright/test');
const { readExcelData } = require('../utils/excelReader');

// 1. Definovanie dátového súboru a listu Login
const EXCEL_FILE_NAME = 'swaglabs_data.xlsx';
const SHEET_NAME = 'Login'; 
const testScenarios = readExcelData(EXCEL_FILE_NAME, SHEET_NAME);

// Zabezpečenie, že testy sa nespustia, ak neboli nájdené dáta
if (testScenarios.length === 0) {
    test.skip(`Playwright nenašiel žiadne dáta v liste ${SHEET_NAME}. Testy sú preskočené.`, () => {});
}

// 2. Prechádzanie dátovými scenármi
for (const scenario of testScenarios) {

    // KONTROLA PRE PRÁZDNE RIADKY (NOVÁ OPRAVA): Ak chýba ID alebo OčakávanýVýsledok, tento scenár preskočíme.
    if (!scenario.TestCaseID || !scenario.OčakávanýVýsledok || String(scenario.TestCaseID).trim() === '') {
        console.log(`[SKIPPING] Preskočený nekompletný riadok s dátami v Login súbore:`, scenario);
        continue;
    }

    // Používame názov z Excelu na zobrazenie v reporte
    test(`TC: ${scenario.TestCaseID} - Prihlásenie: ${scenario.OčakávanýVýsledok}`, async ({ page }) => {
        
        await test.step('1. Navigácia a vyplnenie údajov', async () => {
            // page.goto('/') použije 'https://www.saucedemo.com' vďaka BaseURL
            await page.goto('/'); 
            await page.fill('[data-test="username"]', scenario.Meno); 
            await page.fill('[data-test="password"]', scenario.Heslo);
        });

        await test.step('2. Kliknutie a overenie výsledku', async () => {
            await page.click('[data-test="login-button"]');

            const expectedResult = scenario.OčakávanýVýsledok;

            if (expectedResult === 'Úspešné_prihlásenie') {
                // Očakávame presmerovanie na stránku s produktmi
                await expect(page).toHaveURL(/.*inventory.html/); 
                console.log(`[PASS] ${scenario.TestCaseID}: Úspešné prihlásenie overené.`);

            } else if (expectedResult === 'Chyba_používateľ_zamknutý') {
                // Očakávame, že sa zobrazí chybová hláška (locked_out_user)
                const errorLocator = page.locator('[data-test="error"]');
                await expect(errorLocator).toBeVisible();
                await expect(errorLocator).toContainText('Sorry, this user has been locked out.');
                console.log(`[PASS] ${scenario.TestCaseID}: Chyba zamknutého používateľa overená.`);
                
            } else if (expectedResult === 'Chyba_nesprávne_údaje') {
                // Očakávame chybovú hlášku pre nesprávne meno/heslo
                const errorLocator = page.locator('[data-test="error"]');
                await expect(errorLocator).toBeVisible();
                await expect(errorLocator).toContainText('Username and password do not match any user in this service');
                console.log(`[PASS] ${scenario.TestCaseID}: Chyba nesprávnych údajov overená.`);
            }
        });
    });
}

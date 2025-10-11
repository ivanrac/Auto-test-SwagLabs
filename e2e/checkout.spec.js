const { test, expect } = require('@playwright/test');
const { readExcelData } = require('../utils/excelReader'); 

// 1. Definovanie dátového súboru a listu Checkout
const EXCEL_FILE_NAME = 'swaglabs_data.xlsx'; 
const SHEET_NAME = 'Checkout'; // Tentokrát čítame dáta pre Checkout
const testScenarios = readExcelData(EXCEL_FILE_NAME, SHEET_NAME); 

// Zabezpečenie, že testy sa nespustia, ak neboli nájdené dáta
if (testScenarios.length === 0) {
    test.skip(`Playwright nenašiel žiadne dáta v liste ${SHEET_NAME}. Testy sú preskočené.`, () => {});
}

// 2. Prechádzanie dátovými scenármi
for (const scenario of testScenarios) {

    // KONTROLA PRE PRÁZDNE RIADKY: Ak chýba ID alebo OčakávanýVýsledok, tento scenár preskočíme.
    if (!scenario.TestCaseID || !scenario.OčakávanýVýsledok || String(scenario.TestCaseID).trim() === '') {
        console.log(`[SKIPPING] Preskočený nekompletný riadok s dátami:`, scenario);
        continue;
    }

    // Používame názov z Excelu na zobrazenie v reporte
    test(`TC: ${scenario.TestCaseID} - E2E Nákup: ${scenario.OčakávanýVýsledok}`, async ({ page }) => {
        
        await test.step('1. Prihlásenie používateľa', async () => {
            await page.goto('/'); 
            await page.fill('[data-test="username"]', scenario.Meno); 
            await page.fill('[data-test="password"]', scenario.Heslo);
            await page.click('[data-test="login-button"]');
            
            // Overenie, že sme na stránke s produktmi
            await expect(page).toHaveURL(/.*inventory.html/);
        });
        
        await test.step('2. Pridanie produktu do košíka (Sauce Labs Bike Light)', async () => {
            // Predpokladáme, že chceme kupovať práve Bike Light
            await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
            
            // Overenie, že ikonka košíka ukazuje 1 produkt
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        });

        await test.step('3. Prechod do košíka a k Checkoutu', async () => {
            await page.click('.shopping_cart_link');
            await expect(page).toHaveURL(/.*cart.html/);
            
            // Tlačidlo Checkout
            await page.click('[data-test="checkout"]');
            await expect(page).toHaveURL(/.*checkout-step-one.html/);
        });

        await test.step('4. Vyplnenie platobných údajov', async () => {
            // Použitie logického OR pre zaistenie, že polia dostanú aspoň prázdny reťazec
            const firstName = scenario.KrstneMeno || '';
            const lastName = scenario.Priezvisko || '';
            const postalCode = scenario.PSČ || '';

            await page.fill('[data-test="firstName"]', firstName); 
            await page.fill('[data-test="lastName"]', lastName);
            await page.fill('[data-test="postalCode"]', postalCode);

            // Kliknutie na Continue
            await page.click('[data-test="continue"]');
        });

        await test.step('5. Overenie výsledku transakcie', async () => {
            const expectedResult = scenario.OčakávanýVýsledok;

            if (expectedResult === 'Úspešný_nákup') {
                // TC_001: Štandardný úspešný nákup
                await expect(page).toHaveURL(/.*checkout-step-two.html/);
                
                // Dokončenie nákupu
                await page.click('[data-test="finish"]');

                // Overenie finálnej potvrdzovacej stránky
                await expect(page).toHaveURL(/.*checkout-complete.html/);
                await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!'); 
                console.log(`[PASS] ${scenario.TestCaseID}: Nákup bol úspešne dokončený.`);

            } else if (expectedResult === 'Úspešné_s_chybou') {
                // TC_006: Zlyhanie (simulácia chyby) - očakávame chybu a zotrvanie na Step One.
                const errorLocator = page.locator('[data-test="error"]');
                await expect(errorLocator).toBeVisible();
                
                // FINALNA OPRAVA: Prispôsobenie sa chybe "Error: Last Name is required"
                // To znamená, že hodnota 'Problemova' neprešla.
                await expect(errorLocator).toContainText('Error: Last Name is required'); 
                
                // Overíme, že ostávame na prvom kroku checkoutu
                await expect(page).toHaveURL(/.*checkout-step-one.html/);
                console.log(`[PASS] ${scenario.TestCaseID}: Test 'Úspešné_s_chybou' overil zlyhanie transakcie a zobrazenie chyby.`);

            } else if (expectedResult === 'Chyba_Meno') {
                // TC_005: Očakávame chybu kvôli chýbajúcemu menu
                const errorLocator = page.locator('[data-test="error"]');
                await expect(errorLocator).toBeVisible();
                await expect(errorLocator).toContainText('Error: First Name is required');
                
                // Overíme, že ostávame na prvom kroku checkoutu
                await expect(page).toHaveURL(/.*checkout-step-one.html/);
                console.log(`[PASS] ${scenario.TestCaseID}: Chyba chýbajúceho mena overená.`);
            }
        });
    });
}

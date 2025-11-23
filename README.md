# 🧪 Auto-test-SwagLabs: Robustný E2E Playwright Framework

[![Playwright](https://img.shields.io/badge/Tested%20with-Playwright-2FBC4B.svg)](https://playwright.dev/)
[![Language](https://img.shields.io/badge/Language-Python-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Test Target](https://img.shields.io/badge/Target-Swag%20Labs-E20B0B.svg)](https://www.saucedemo.com/)

## 🚀 Prehľad projektu

Tento repozitár obsahuje komplexný **End-to-End (E2E) testovací framework** vyvinutý na overenie funkčnosti demo e-commerce webovej stránky **Swag Labs**. Framework využíva modernú knižnicu **Playwright** pre rýchlu a spoľahlivú automatizáciu prehliadača.

### Kľúčové vlastnosti:

* **Data-Driven Testing (DDT):** Testy využívajú externé dáta (napr. z CSV/JSON súborov) pre jednoduchú správu testovacích prípadov.
* **Page Object Model (POM):** Čistá a udržateľná štruktúra testov pre ľahkú orientáciu a minimalizáciu duplicitného kódu.
* **Komplexné overenie:** Zabezpečuje bezchybnú funkčnosť kritických častí webu.

## 🎯 Testované scenáre

Framework pokrýva kompletný používateľský tok, vrátane:

* ✅ **Autentifikácia:** Prihlásenie s rôznymi sadami používateľských údajov.
* ✅ **Nákupný tok:** Pridávanie tovaru do košíka, odobratie, a kompletný proces objednávky (Checkout).
* ✅ **Validácia dát:** Kontrola správneho zobrazenia dát v košíku a na stránke s prehľadom objednávky.

## 🛠 Technológie a predpoklady

Na spustenie tohto projektu potrebujete mať nainštalované nasledujúce nástroje:

* **Jazyk:** [Python] (alebo iný, ak používate)
* **Nástroj:** Playwright
* **Správca balíčkov:** pip (alebo iný)

### Spustenie projektu

1.  **Klonovanie repozitára:**
    ```bash
    git clone [https://github.com/ivanrac/Auto-test-SwagLabs.git](https://github.com/ivanrac/Auto-test-SwagLabs.git)
    cd Auto-test-SwagLabs
    ```

2.  **Inštalácia závislostí:**
    (Predpokladajme, že máte súbor `requirements.txt` alebo `package.json`)
    ```bash
    pip install -r requirements.txt 
    # alebo npm install, ak ide o JS/TS
    ```

3.  **Inštalácia Playwright prehliadačov:**
    ```bash
    playwright install
    ```

4.  **Spustenie testov:**
    ```bash
    # Príklad príkazu na spustenie všetkých testov
    pytest --browser=chromium
    # alebo npx playwright test, ak ide o JS/TS
    ```

## 📄 Licencia

Tento projekt je licencovaný pod licenciou Apache License
                           Version 2.0, January 2004.

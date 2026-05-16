import { test, expect } from '@playwright/test';

const USER_TEST = 'tester@streetcats.com';
const PASS_TEST = 'Streetcats2026';

test.describe('StreetCats E2E Tests', () => {

  // TEST 1
  test('Test 1: La pagina principale si carica e mostra la mappa', async ({ page }) => {
    await page.goto('http://localhost:4200');

    await page.getByRole('button', { name: /Inizia!/i }).click();

    await expect(page.locator('.map-container')).toBeVisible();
  });

  // TEST 2
  test('Test 2: La searchbar di geocoding accetta input e si svuota', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.getByRole('button', { name: /Inizia!/i }).click();
    const searchInput = page.getByPlaceholder('Cerca un indirizzo, città o quartiere...');
    await searchInput.fill('Roma');
    await searchInput.press('Enter');
    await expect(searchInput).toHaveValue('');
  });

test('Test 3: Click sulla mappa da utente non loggato mostra alert', async ({ page }) => {
    await page.goto('http://localhost:4200');

    await page.getByRole('button', { name: /Inizia!/i }).click();


    await page.locator('.map-container').click();

    await expect(page.getByText(/Ehi, miao!/i)).toBeVisible();
  });

  //TEST 4

  test('Test 4:  Il pulsante accedi porta alla login page', async ({page}) => {
    await page.goto('http://localhost:4200');
    await page.getByRole('button', {name: /Inizia!/i }).click();

    await page.getByRole('link', { name: /Accedi/i }).click();
    await expect(page).toHaveURL('http://localhost:4200/login');

});

//TEST 5
test('Test 5: Il form di login disabilitato se vuoto', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    // Prende genericamente il primo input della pagina (username/email)
    const usernameInput = page.locator('input').first();
    const passwordInput = page.locator('input[type="password"]');
    const btnSubmit = page.locator('button[type="submit"]');

    await usernameInput.focus();
    await passwordInput.focus();
    await btnSubmit.focus();

    await expect(btnSubmit).toBeDisabled();
  });
//TEST 6
test('Test 6: L\'utente effettua il login', async ({ page }) => {
await page.goto('http://localhost:4200/login');

await page.locator('input[formControlName="email"]').fill(USER_TEST);
await page.locator('input[formControlName="password"]').fill(PASS_TEST);

await page.locator('button[type="submit"]').click();
await expect(page).toHaveURL('http://localhost:4200/');

  });

//TEST 7
test('Test 7: Click sulla mappa da utente loggato apre la modale "Aggiungi Gatto"', async ({ page }) => {
    // Login
    await page.goto('http://localhost:4200/login');
    await page.locator('input[formControlName="email"]').fill(USER_TEST);
    await page.locator('input[formControlName="password"]').fill(PASS_TEST);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('http://localhost:4200/');

    //  Chiusura della modale di benvenuto
    await page.getByRole('button', { name: /Inizia!/i }).click();

    //  Click sulla mappa, al centro (la mappa è centrata su roma)
    await page.locator('.map-container').click();



    //aspetto che il messaggio di caricamento scompaia (quindi nominatim ha risposto)
    await expect(page.getByText(/Sto controllando la zona.../i)).toBeHidden();

    // Nominatim ha risposto, mi aspetto che la modale sia aperta
   await expect(page.getByText(/Segnala un nuovo/i)).toBeVisible();
  });

test('Test 8: Il form aggiungi gatto richiede dati', async ({ page }) => {
    // Login
    await page.goto('http://localhost:4200/login');
    await page.locator('input[formControlName="email"]').fill(USER_TEST);
    await page.locator('input[formControlName="password"]').fill(PASS_TEST);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('http://localhost:4200/');

    //  Chiusura della modale di benvenuto
    await page.getByRole('button', { name: /Inizia!/i }).click();

    await page.locator('.map-container').click();

    await expect(page.getByText(/Sto controllando la zona.../i)).toBeHidden();

    const btnSalva = page.getByRole('button', { name: /Salva/i });
    await expect(btnSalva).toBeVisible();

    await expect(btnSalva).toBeDisabled();
  });


test('Test 9: Click su marker della mappa apre i dettagli del gatto', async ({ page }) => {
    await page.goto('http://localhost:4200/');


    await page.getByRole('button', { name: /Inizia!/i }).click();

    // marker da cliccare, non importa quale sia
    const primoMarker = page.locator('.leaflet-marker-icon').first();

    //asoetto che sia visibile e che risponda il backend
    await expect(primoMarker).toBeVisible();

    await primoMarker.evaluate((node) => node.click());


    await expect(page.getByText(/Avvistato da/i)).toBeVisible();
  });


test('Test 10: Sezione commenti bloccata per anonimi', async ({ page }) => {
    await page.goto('http://localhost:4200/');

    await page.getByRole('button', { name: /Inizia!/i }).click();


    const primoMarker = page.locator('.leaflet-marker-icon').first();

    await expect(primoMarker).toBeVisible();

    await primoMarker.evaluate((node) => node.click());

    await expect(page.getByText(/Accedi oppure Registrati/i)).toBeVisible();
  });




});

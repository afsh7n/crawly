import * as fs from 'fs/promises';
import { Page } from 'puppeteer';

/**
 * Saves cookies from the given page to a file.
 * @param page - The Puppeteer page instance.
 * @param filePath - Path to save the cookies file.
 */
export async function saveCookies(page: Page, filePath: string): Promise<void> {
    try {
        const cookies = await page.cookies();
        await fs.writeFile(filePath, JSON.stringify(cookies, null, 2));
    } catch (error) {
        throw new Error(`Failed to save cookies: ${(error as Error).message}`);
    }
}

/**
 * Loads cookies from a file and sets them on the given page.
 * @param page - The Puppeteer page instance.
 * @param filePath - Path to the cookies file.
 */
export async function loadCookies(page: Page, filePath: string): Promise<void> {
    try {
        const cookies = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        await page.setCookie(...cookies);
    } catch (error) {
        throw new Error(`Failed to load cookies: ${(error as Error).message}`);
    }
}

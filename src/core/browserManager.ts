import puppeteer, { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A utility class for managing Puppeteer browser instances and pages.
 */
export class BrowserManager {
    private browser: Browser | null = null;
    private pages: Page[] = [];
    private manageErrors: boolean;
    private delayTime: number = 3000;

    /**
     * Initializes the BrowserManager.
     * @param manageErrors - Whether to handle browser-related errors automatically. Default is true.
     */
    constructor(manageErrors = true) {
        this.manageErrors = manageErrors;
    }

    /**
     * Terminates all active Chrome processes.
     * @returns A boolean indicating whether the processes were successfully terminated.
     */
    async killChromeProcesses(): Promise<boolean> {
        try {
            const { stdout, stderr } = await execPromise('taskkill /IM chrome.exe /F');
            return true;
        } catch (error: any) {
            if (!error.message.includes('not found')) {
                return false;
            }
            return true;
        }
    }

    /**
     * Initializes a Puppeteer browser instance with error handling and retries.
     * @param launchOptions - Puppeteer launch options for the browser.
     * @param retryCount - The maximum number of retries to initialize the browser. Default is 3.
     * @throws An error if initialization fails after all retries.
     */
    private async initPuppeteer(launchOptions: PuppeteerLaunchOptions, retryCount = 3): Promise<void> {
        let attempt = 0;
        while (attempt < retryCount) {
            try {
                if (this.manageErrors) {
                    await this.killChromeProcesses();
                    await delay(this.delayTime);
                }
                this.browser = await puppeteer.launch(launchOptions);
                console.log('Puppeteer initialized successfully');
                return;
            } catch (error: any) {
                console.error(`Attempt ${attempt + 1} failed to initialize Puppeteer: ${error.message}`);
                attempt++;
                await delay(this.delayTime);
            }
        }
        throw new Error('Failed to initialize Puppeteer after multiple attempts');
    }

    /**
     * Launches a Puppeteer browser instance.
     * @param options - Puppeteer launch options for the browser.
     * @returns The launched Puppeteer browser instance.
     */
    async launchBrowser(options: PuppeteerLaunchOptions): Promise<Browser> {
        if (this.manageErrors) {
            await this.initPuppeteer(options);
        } else {
            this.browser = await puppeteer.launch(options);
        }
        return this.browser!;
    }

    /**
     * Creates a new page in the current browser instance.
     * @returns The newly created Puppeteer page.
     * @throws An error if the browser is not initialized or page creation fails.
     */
    async createPage(): Promise<Page> {
        if (!this.browser) {
            throw new Error('Browser not launched. Call launchBrowser() first.');
        }
        try {
            const page = await this.browser.newPage();
            this.pages.push(page);
            return page;
        } catch (error: any) {
            throw new Error('Failed to create a new page');
        }
    }

    /**
     * Closes the current browser instance and clears all active pages.
     */
    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.pages = [];
        }
    }

    /**
     * Retrieves a specific page by its index.
     * @param index - The index of the page in the list of opened pages.
     * @returns The Puppeteer page at the specified index.
     * @throws An error if the index is out of bounds.
     */
    getPage(index: number): Page {
        if (index < 0 || index >= this.pages.length) {
            throw new Error('Invalid page index');
        }
        return this.pages[index];
    }

    /**
     * Retrieves all active pages in the current browser instance.
     * @returns An array of all active Puppeteer pages.
     */
    getAllPages(): Page[] {
        return this.pages;
    }

    /**
     * Checks whether the browser is currently launched.
     * @returns A boolean indicating whether the browser is initialized.
     */
    isBrowserLaunched(): boolean {
        return this.browser !== null;
    }
}

import puppeteer, { Page, ElementHandle, Cookie, Protocol, WaitForOptions,GoToOptions } from 'puppeteer';

/**
 * A utility class for managing interactions with a Puppeteer page.
 */
export class PageManager {
    constructor(private page: Page) {}

    /**
     * Navigates to a specified URL with customizable options.
     * @param url - The URL to navigate to.
     * @param options - Navigation options from Puppeteer.
     */
    async navigateTo(url: string, options?: GoToOptions): Promise<void> {
        await this.page.goto(url, options);
    }

    /**
     * Waits for an element matching the specified selector to appear on the page with customizable options.
     * @param selector - The CSS selector of the element to wait for.
     * @param options - Options for waiting, such as timeout and visibility.
     * @throws If the element does not appear within the specified timeout.
     */
    async waitForSelector(selector: string, options?: WaitForOptions): Promise<void> {
        await this.page.waitForSelector(selector, options);
    }

    /**
     * Reloads the current page with customizable options.
     * @param options - Navigation options for reloading the page.
     */
    async reload(options?: GoToOptions): Promise<void> {
        await this.page.reload(options);
    }

    /**
     * Waits for the specified amount of time.
     * @param ms - The amount of time to wait, in milliseconds.
     */
    async waitFor(ms: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Scrolls to the bottom of the page.
     */
    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
    }

    /**
     * Scrolls to an element matching the specified selector.
     * @param selector - The CSS selector of the element to scroll to.
     * @throws If the element is not found.
     */
    async scrollToElement(selector: string): Promise<void> {
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Selector ${selector} not found`);
        }
        await this.page.evaluate((el) => el.scrollIntoView(), element);
    }

    /**
     * Extracts and returns all hyperlinks from the page.
     * @returns An array of URLs found in the page's hyperlinks.
     */
    async getAllLinks(): Promise<string[]> {
        return await this.page.$$eval('a', (anchors) => anchors.map((a) => a.href));
    }

    /**
     * Captures a screenshot of the entire page and saves it to the specified file path.
     * @param filePath - The path where the screenshot will be saved.
     */
    async takeScreenshot(filePath: string): Promise<void> {
        await this.page.screenshot({ path: filePath, fullPage: true });
    }

    /**
     * Captures a screenshot of a specific element and saves it to the specified file path.
     * @param selector - The CSS selector of the element to capture.
     * @param filePath - The path where the screenshot will be saved.
     * @throws If the element is not found.
     */
    async takeElementScreenshot(selector: string, filePath: string): Promise<void> {
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Selector ${selector} not found`);
        }
        await element.screenshot({ path: filePath });
    }

    /**
     * Extracts and returns the text content of an element matching the specified selector.
     * @param selector - The CSS selector of the element.
     * @returns The text content of the element, or null if the element is empty.
     * @throws If the element is not found.
     */
    async getText(selector: string): Promise<string | null> {
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Selector ${selector} not found`);
        }
        return await this.page.evaluate((el) => el.textContent?.trim() || null, element);
    }

    /**
     * Extracts and returns the value of a specific attribute from an element.
     * @param selector - The CSS selector of the element.
     * @param attribute - The name of the attribute to retrieve.
     * @returns The value of the attribute, or null if the attribute is not found.
     * @throws If the element is not found.
     */
    async getAttribute(selector: string, attribute: string): Promise<string | null> {
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Selector ${selector} not found`);
        }
        return await this.page.evaluate((el, attr) => el.getAttribute(attr), element, attribute);
    }

    /**
     * Checks whether an element matching the specified selector exists on the page.
     * @param selector - The CSS selector of the element to check.
     * @returns True if the element exists, otherwise false.
     */
    async isElementPresent(selector: string): Promise<boolean> {
        const element = await this.page.$(selector);
        return element !== null;
    }

    /**
     * Sets a cookie for the current page.
     * @param name - The name of the cookie.
     * @param value - The value of the cookie.
     */
    async setCookie(name: string, value: string): Promise<void> {
        const cookies = [{ name, value, url: this.page.url() }];
        await this.page.setCookie(...cookies);
    }

    /**
     * Retrieves all cookies from the current page.
     * @returns An array of cookies.
     */
    async getCookies(): Promise<Cookie[]> {
        return await this.page.cookies();
    }

    /**
     * Clicks on an element matching the specified selector.
     * @param selector - The CSS selector of the element to click.
     * @throws If the element is not found.
     */
    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }

    /**
     * Types text into an element matching the specified selector.
     * @param selector - The CSS selector of the input element.
     * @param text - The text to type into the element.
     * @throws If the element is not found.
     */
    async type(selector: string, text: string): Promise<void> {
        await this.page.type(selector, text);
    }

    /**
     * Uploads a file to an input element matching the specified selector.
     * @param selector - The CSS selector of the file input element.
     * @param filePath - The path to the file to upload.
     * @throws If the element is not found or is not a valid file input.
     */
    async uploadFile(selector: string, filePath: string): Promise<void> {
        const input = await this.page.$(selector);
        if (!input) {
            throw new Error(`Selector ${selector} not found`);
        }
        const fileInput = input as ElementHandle<HTMLInputElement>;
        if (!fileInput) {
            throw new Error(`Element found by ${selector} is not a file input.`);
        }
        await fileInput.uploadFile(filePath);
    }
}

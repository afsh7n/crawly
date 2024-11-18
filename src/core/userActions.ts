import puppeteer, {ElementHandle, Page} from 'puppeteer';

/**
 * A utility class for managing common user actions on a Puppeteer page.
 */
export class UserActions {
    constructor(private page: Page) {}

    /**
     * Logs in on a single-page login form.
     * @param usernameSelector - The CSS selector for the username or email input field.
     * @param passwordSelector - The CSS selector for the password input field.
     * @param submitSelector - The CSS selector for the submit button.
     * @param credentials - An object containing username and password.
     */
    async login(
        usernameSelector: string,
        passwordSelector: string,
        submitSelector: string,
        credentials: { username: string; password: string }
    ): Promise<void> {
        await this.page.type(usernameSelector, credentials.username);
        await this.page.type(passwordSelector, credentials.password);
        await this.page.click(submitSelector);
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    /**
     * Logs in using a multi-page flow (e.g., email on the first page, password on the second page).
     * @param emailSelector - The CSS selector for the email input field.
     * @param emailSubmitSelector - The CSS selector for the button to proceed after entering the email.
     * @param passwordSelector - The CSS selector for the password input field on the second page.
     * @param passwordSubmitSelector - The CSS selector for the button to log in after entering the password.
     * @param credentials - An object containing email and password.
     */
    async multiPageLogin(
        emailSelector: string,
        emailSubmitSelector: string,
        passwordSelector: string,
        passwordSubmitSelector: string,
        credentials: { email: string; password: string }
    ): Promise<void> {
        await this.page.type(emailSelector, credentials.email);
        await this.page.click(emailSubmitSelector);
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        await this.page.type(passwordSelector, credentials.password);
        await this.page.click(passwordSubmitSelector);
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    /**
     * Clicks on a button or link and waits for navigation.
     * @param selector - The CSS selector for the button or link.
     */
    async clickAndWait(selector: string): Promise<void> {
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
            this.page.click(selector),
        ]);
    }

    /**
     * Types text into an input field with an optional delay between keystrokes.
     * @param selector - The CSS selector for the input field.
     * @param text - The text to type.
     * @param delay - Optional delay in milliseconds between each keystroke. Default is 100ms.
     */
    async typeWithDelay(selector: string, text: string, delay = 100): Promise<void> {
        await this.page.type(selector, text, { delay });
    }

    /**
     * Selects an option from a dropdown menu.
     * @param selector - The CSS selector for the dropdown menu.
     * @param value - The value of the option to select.
     */
    async selectDropdown(selector: string, value: string): Promise<void> {
        await this.page.select(selector, value);
    }

    /**
     * Uploads a file to an input element.
     * @param selector - The CSS selector for the file input element.
     * @param filePath - The path to the file to upload.
     */
    async uploadFile(selector: string, filePath: string): Promise<void> {
        const input = await this.page.$(selector);
        if (!input) {
            throw new Error(`Selector ${selector} not found`);
        }

        // Explicitly cast the element to an input element with setInputFiles
        const fileInput = input as ElementHandle<HTMLInputElement>;

        // Use type assertion to suppress TypeScript error
        if ('setInputFiles' in fileInput) {
            await (fileInput as any).setInputFiles(filePath);
        } else {
            throw new Error(`setInputFiles method is not available on the selected input element.`);
        }
    }

    /**
     * Checks if an element is visible on the page.
     * @param selector - The CSS selector for the element.
     * @returns A boolean indicating whether the element is visible.
     */
    async isElementVisible(selector: string): Promise<boolean> {
        const element = await this.page.$(selector);
        if (!element) return false;
        const boundingBox = await element.boundingBox();
        return boundingBox !== null;
    }

    /**
     * Scrolls to an element and clicks on it.
     * @param selector - The CSS selector for the element.
     */
    async scrollToAndClick(selector: string): Promise<void> {
        const element = await this.page.$(selector);
        if (!element) {
            throw new Error(`Selector ${selector} not found`);
        }
        await this.page.evaluate((el) => el.scrollIntoView(), element);
        await element.click();
    }

    /**
     * Waits for a specific element to appear on the page.
     * @param selector - The CSS selector for the element.
     * @param timeout - Optional timeout in milliseconds to wait for the element. Default is 5000ms.
     */
    async waitForElement(selector: string, timeout = 5000): Promise<void> {
        await this.page.waitForSelector(selector, { timeout });
    }
}

import { Page } from 'puppeteer';

/**
 * A utility class for extracting data from a Puppeteer page.
 */
export class DataExtractor {
    private selectors: Record<string, { selector: string; multiple?: boolean }> = {};

    /**
     * Adds a selector to the extractor.
     * @param name - The name of the data to extract.
     * @param selector - The CSS selector to use.
     * @param multiple - Whether to extract multiple elements. Default is false.
     * @returns The current instance of the DataExtractor for chaining.
     */
    addSelector(name: string, selector: string, multiple = false): this {
        this.selectors[name] = { selector, multiple };
        return this;
    }

    /**
     * Extracts data based on the configured selectors.
     * @param page - The Puppeteer page instance.
     * @param transformFn - Optional transformation function for extracted data.
     * @returns A record containing the extracted data.
     */
    async extract(
        page: Page,
        transformFn?: (data: Record<string, any>) => Record<string, any>
    ): Promise<Record<string, any>> {
        const data: Record<string, any> = {};

        for (const [name, { selector, multiple }] of Object.entries(this.selectors)) {
            try {
                if (multiple) {
                    data[name] = await page.$$eval(selector, (elements) =>
                        elements.map((el) => el.textContent?.trim() || null)
                    );
                } else {
                    data[name] = await page.$eval(selector, (el) => el.textContent?.trim() || null);
                }
            } catch {
                data[name] = multiple ? [] : null;
            }
        }

        return transformFn ? transformFn(data) : data;
    }

    /**
     * Extracts attributes from elements matching the specified selector.
     * @param page - The Puppeteer page instance.
     * @param selector - The CSS selector to extract attributes from.
     * @param attribute - The attribute to extract.
     * @returns An array of attribute values.
     */
    async extractAttributes(page: Page, selector: string, attribute: string): Promise<string[]> {
        try {
            return await page.$$eval(selector, (elements, attr) =>
                elements.map((el) => el.getAttribute(attr) || ''), attribute
            );
        } catch {
            return [];
        }
    }

    /**
     * Extracts HTML content from an element matching the specified selector.
     * @param page - The Puppeteer page instance.
     * @param selector - The CSS selector to extract HTML from.
     * @returns The inner HTML of the element, or null if not found.
     */
    async extractHTML(page: Page, selector: string): Promise<string | null> {
        try {
            return await page.$eval(selector, (el) => el.innerHTML || null);
        } catch {
            return null;
        }
    }

    /**
     * Extracts an array of HTML content from elements matching the specified selector.
     * @param page - The Puppeteer page instance.
     * @param selector - The CSS selector to extract HTML from.
     * @returns An array of inner HTML strings.
     */
    async extractMultipleHTML(page: Page, selector: string): Promise<string[]> {
        try {
            return await page.$$eval(selector, (elements) =>
                elements.map((el) => el.innerHTML || '')
            );
        } catch {
            return [];
        }
    }

    /**
     * Extracts links (href attributes) from anchor tags matching the specified selector.
     * @param page - The Puppeteer page instance.
     * @param selector - The CSS selector to extract links from.
     * @returns An array of href values.
     */
    async extractLinks(page: Page, selector: string): Promise<string[]> {
        return this.extractAttributes(page, selector, 'href');
    }

    /**
     * Clears all configured selectors.
     */
    clearSelectors(): void {
        this.selectors = {};
    }

    /**
     * Returns the current list of configured selectors.
     * @returns An object containing the configured selectors.
     */
    getSelectors(): Record<string, { selector: string; multiple?: boolean }> {
        return this.selectors;
    }
}

import { Page, HTTPRequest } from 'puppeteer';

/**
 * A utility class for intercepting and managing network requests on a Puppeteer page.
 */
export class RequestManager {
    private requests: Record<string, any>[] = [];

    /**
     * Initializes the RequestManager with a Puppeteer page instance.
     * @param page - The Puppeteer page to manage requests for.
     */
    constructor(private page: Page) {}

    /**
     * Enables request interception and starts capturing network requests.
     */
    async interceptRequests(): Promise<void> {
        await this.page.setRequestInterception(true);
        this.page.on('request', (request) => {
            this.requests.push({
                url: request.url(),
                method: request.method(),
                headers: request.headers(),
                resourceType: request.resourceType(),
            });
            request.continue();
        });
    }

    /**
     * Returns all captured network requests.
     * @returns An array of captured network request objects.
     */
    getRequests(): Record<string, any>[] {
        return this.requests;
    }

    /**
     * Filters captured requests by HTTP method (e.g., GET, POST).
     * @param method - The HTTP method to filter requests by.
     * @returns An array of requests matching the specified method.
     */
    filterRequestsByMethod(method: string): Record<string, any>[] {
        return this.requests.filter((request) => request.method === method.toUpperCase());
    }

    /**
     * Filters captured requests by URL or a part of the URL.
     * @param urlKeyword - A keyword to match in the request URLs.
     * @returns An array of requests containing the keyword in their URLs.
     */
    filterRequestsByUrl(urlKeyword: string): Record<string, any>[] {
        return this.requests.filter((request) => request.url.includes(urlKeyword));
    }

    /**
     * Blocks specific resource types (e.g., images, stylesheets).
     * @param resourceTypes - An array of resource types to block.
     */
    async blockResourceTypes(resourceTypes: string[]): Promise<void> {
        await this.page.setRequestInterception(true);
        this.page.on('request', (request: HTTPRequest) => {
            if (resourceTypes.includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    /**
     * Allows mocking or modifying network requests.
     * @param modifyCallback - A callback function to modify or mock requests.
     */
    async modifyRequests(modifyCallback: (request: HTTPRequest) => void): Promise<void> {
        await this.page.setRequestInterception(true);
        this.page.on('request', (request: HTTPRequest) => {
            modifyCallback(request);
        });
    }

    /**
     * Clears all captured network requests.
     */
    clearRequests(): void {
        this.requests = [];
    }
}

import { BrowserManager } from './browserManager';
import { PageManager } from './pageManager';
import { DataExtractor } from './dataExtractor';
import { RequestManager } from './requestManager';
import { UserActions } from './userActions';
import {PuppeteerLaunchOptions} from "puppeteer";

export class Crawly {
    private browserManager = new BrowserManager();
    private page: any;

    async init(options: PuppeteerLaunchOptions): Promise<void> {
        await this.browserManager.launchBrowser(options);
        this.page = await this.browserManager.createPage();
    }

    async navigate(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'networkidle0' });
    }

    async extractData(selectors: Record<string, string>): Promise<Record<string, any>> {
        const extractor = new DataExtractor();
        for (const [key, selector] of Object.entries(selectors)) {
            extractor.addSelector(key, selector);
        }
        return await extractor.extract(this.page);
    }

    async login(credentials: { username: string; password: string }, selectors: { username: string; password: string; submit: string }): Promise<void> {
        const actions = new UserActions(this.page);
        await actions.login(selectors.username, selectors.password, selectors.submit, credentials);
    }

    async close(): Promise<void> {
        await this.browserManager.closeBrowser();
    }
}

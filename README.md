# Crawly Automation

**Crawly Automation** is a lightweight, modular, and extensible web crawling framework built on top of Puppeteer. Whether you need to scrape data, automate browser interactions, manage CAPTCHAs, or handle advanced data extraction, Crawly Automation simplifies the process.

---

## 🚀 Features

- **Browser Management**: Launch, manage, and close browsers and pages with ease.
- **Request Handling**: Intercept, filter, and modify network requests dynamically.
- **Data Extraction**: Extract structured or unstructured data with customizable selectors.
- **Data Formatting**: Convert extracted data to **JSON** or **CSV** with built-in utilities.
- **CAPTCHA Handling**: Solve CAPTCHAs (reCAPTCHA) automatically using third-party services like 2Captcha.
- **User Actions**: Simulate complex user interactions like single-page and multi-page logins, dropdown selection, file uploads, and more.
- **Utilities**: Handy tools for delays, logging, and helper functions.

---

## 📦 Installation

Install Crawly Automation via NPM:

```bash
npm install crawly-automation
```

---

## 🔧 Usage

Here’s a quick guide to get you started with Crawly Automation.

---

### **1. Browser Management**

Launch a browser, create a page, and navigate to a URL:

```typescript
import { BrowserManager } from 'crawly-automation';

(async () => {
  const browserManager = new BrowserManager();

  const browser = await browserManager.launchBrowser({ headless: false });
  const page = await browserManager.createPage();

  await page.goto('https://example.com');
  console.log('Page title:', await page.title());

  await browserManager.closeBrowser();
})();
```

---

### **2. Data Extraction**

Extract data from a webpage using selectors:

```typescript
import { DataExtractor } from 'crawly-automation';

(async () => {
  const browserManager = new BrowserManager();
  const browser = await browserManager.launchBrowser();
  const page = await browserManager.createPage();

  await page.goto('https://example.com');

  const extractor = new DataExtractor();
  extractor.addSelector('title', 'h1').addSelector('items', '.item', true);

  const data = await extractor.extract(page);
  console.log('Extracted Data:', data);

  await browserManager.closeBrowser();
})();
```

Output:
```json
{
  "title": "Example Title",
  "items": ["Item 1", "Item 2", "Item 3"]
}
```

---

### **3. Data Formatting (JSON and CSV)**

Convert extracted data to **JSON** or **CSV** using built-in utilities:

```typescript
import { DataExtractor } from 'crawly-automation';

(async () => {
  const browserManager = new BrowserManager();
  const browser = await browserManager.launchBrowser();
  const page = await browserManager.createPage();

  await page.goto('https://example.com');

  const extractor = new DataExtractor();
  extractor.addSelector('items', '.item', true);

  const jsonData = await extractor.extractFormatted(page, 'json');
  console.log('JSON Data:', jsonData);

  const csvData = await extractor.extractFormatted(page, 'csv');
  console.log('CSV Data:\n', csvData);

  await browserManager.closeBrowser();
})();
```

---

### **4. CAPTCHA Handling**

Solve CAPTCHAs (e.g., reCAPTCHA) automatically with 2Captcha or similar services:

#### **Step 1: Configure CAPTCHA Solver**
Set up the CAPTCHA solver with your API key:

```typescript
import { BrowserManager } from 'crawly-automation';

const browserManager = new BrowserManager();

// Configure RecaptchaPlugin
browserManager.setRecaptchaConfig({
    id: '2captcha',
    token: 'YOUR_2CAPTCHA_API_KEY',
});
```

#### **Step 2: Handle CAPTCHA**
Handle CAPTCHAs during your crawling process:

```typescript
(async () => {
  const browser = await browserManager.launchBrowser();
  const page = await browser.newPage();

  await page.goto('https://example.com');

  try {
      await browserManager.handleCaptcha(page);
  } catch (error) {
      console.error('CAPTCHA Handling Error:', error.message);
  }

  console.log('CAPTCHA solved, proceeding...');
  await browserManager.closeBrowser();
})();
```

---

### **5. User Actions**

Simulate user interactions like logging in or uploading a file:

#### **Single-Page Login**
```typescript
import { UserActions } from 'crawly-automation';

(async () => {
  const browserManager = new BrowserManager();
  const browser = await browserManager.launchBrowser();
  const page = await browserManager.createPage();

  const userActions = new UserActions(page);

  await userActions.login('#username', '#password', '#submit', {
    username: 'user@example.com',
    password: 'securepassword',
  });

  await browserManager.closeBrowser();
})();
```

---

### **6. Logging and Helpers**

#### **Logging**
Use the built-in `Logger` utility for structured logs:

```typescript
import { Logger } from 'crawly-automation';

Logger.info('This is an informational message.');
Logger.error('An error occurred.');
Logger.debug('Debugging message (only visible if DEBUG=true).');
```

#### **Delay**
Add custom delays between actions:

```typescript
import { delay } from 'crawly-automation';

await delay(3000); // Wait for 3 seconds
```

---

## 🛠️ API Reference

### **BrowserManager**
- `launchBrowser(options: PuppeteerLaunchOptions): Promise<Browser>`
- `setRecaptchaConfig(config: { id: string; token: string }): void`
- `handleCaptcha(page: Page): Promise<boolean>`
- `closeBrowser(): Promise<void>`

### **DataExtractor**
- `addSelector(name: string, selector: string, multiple?: boolean): this`
- `extract(page: Page): Promise<Record<string, any>>`
- `extractFormatted(page: Page, format: 'json' | 'csv'): Promise<string>`

### **Utilities**
- `Logger`: Structured logging (`info`, `warn`, `error`, `debug`)
- `delay(ms: number): Promise<void>`

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Afshin Tavakolian**  
Email: [afsh7n@gmail.com](mailto:afsh7n@gmail.com)  
GitHub: [AfshinTavakolian](https://github.com/afsh7n)

---

## ❤️ Contributions

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/afsh7n/crawly-automation/issues).

---

## 🌟 Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

## 📥 Installation Command

For quick installation, just run:

```bash
npm install crawly-automation
```

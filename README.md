# Crawly Automation

**Crawly Automation** is a lightweight, modular, and extensible web crawling framework built on top of Puppeteer. Whether you need to scrape data, automate browser interactions, or manage multiple requests efficiently, Crawly is here to simplify the process.

---

## 🚀 Features

- **Browser Management**: Launch, manage, and close browsers and pages with ease.
- **Request Handling**: Intercept, filter, and modify network requests dynamically.
- **Data Extraction**: Extract structured or unstructured data with customizable selectors.
- **User Actions**: Simulate complex user interactions like single-page and multi-page logins, dropdown selection, file uploads, and more.
- **Utilities**: Handy tools for delays, logging, and helper functions.

---

## 📦 Installation

Install Crawly via NPM:

```bash
npm install crawly-automation
```

---

## 🔧 Usage

Here’s a quick guide to get you started with Crawly.

### **1. Browser Management**

Launch a browser, create a page, and navigate to a URL:

```typescript
import { BrowserManager } from 'crawly';

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
import { DataExtractor } from 'crawly';

(async () => {
  const extractor = new DataExtractor();
  extractor.addSelector('title', 'h1').addSelector('paragraphs', 'p', true);

  const data = await extractor.extract(page);
  console.log('Extracted Data:', data);
})();
```

Output:
```json
{
  "title": "Example Title",
  "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]
}
```

---

### **3. User Actions**

Simulate user interactions like logging in or uploading a file:

#### **Single-Page Login**
```typescript
import { UserActions } from 'crawly';

(async () => {
  const userActions = new UserActions(page);

  await userActions.login('#username', '#password', '#submit', {
    username: 'user@example.com',
    password: 'securepassword'
  });
})();
```

#### **Multi-Page Login**
```typescript
await userActions.multiPageLogin(
  '#email', 
  '#next-button', 
  '#password', 
  '#login-button', 
  { email: 'user@example.com', password: 'securepassword' }
);
```

#### **File Upload**
```typescript
await userActions.uploadFile('#file-input', './path/to/file.png');
```

---

### **4. Request Management**

Intercept and analyze network requests:

```typescript
import { RequestManager } from 'crawly';

(async () => {
  const requestManager = new RequestManager(page);
  await requestManager.interceptRequests();

  // Navigate to a page
  await page.goto('https://example.com');

  // Get all captured requests
  const requests = requestManager.getRequests();
  console.log('Captured Requests:', requests);
})();
```

---

### **5. Logging and Helpers**

#### **Logging**
Use the built-in `Logger` utility for structured logs:

```typescript
import { Logger } from 'crawly';

Logger.info('This is an informational message.');
Logger.error('An error occurred.');
Logger.debug('Debugging message (only visible if DEBUG=true).');
```

#### **Delay**
Add custom delays between actions:

```typescript
import { delay } from 'crawly';

await delay(3000); // Wait for 3 seconds
```

---

## 🛠️ API Reference

### **BrowserManager**
- `launchBrowser(options: PuppeteerLaunchOptions): Promise<Browser>`
- `createPage(): Promise<Page>`
- `closeBrowser(): Promise<void>`

### **DataExtractor**
- `addSelector(name: string, selector: string, multiple?: boolean): this`
- `extract(page: Page): Promise<Record<string, any>>`
- `extractAttributes(page: Page, selector: string, attribute: string): Promise<string[]>`

### **UserActions**
- `login(usernameSelector: string, passwordSelector: string, submitSelector: string, credentials: { username: string; password: string }): Promise<void>`
- `multiPageLogin(emailSelector: string, emailSubmitSelector: string, passwordSelector: string, passwordSubmitSelector: string, credentials: { email: string; password: string }): Promise<void>`
- `uploadFile(selector: string, filePath: string): Promise<void>`

### **RequestManager**
- `interceptRequests(): Promise<void>`
- `getRequests(): Record<string, any>[]`

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
Feel free to check the [issues page](https://github.com/afsh7n/crawly/issues).

---

## 🌟 Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

## 📥 Installation Command

For quick installation, just run:

```bash
npm install crawly-automation
```

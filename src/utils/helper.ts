import { promises as fs } from 'fs';

/**
 * Generates a random string with a specified length.
 * @param length - The desired length of the random string.
 * @returns A random alphanumeric string.
 */
export const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Reads a JSON file and parses its content.
 * @param filePath - The path to the JSON file.
 * @returns A promise resolving to the parsed JSON content.
 */
export const readJsonFile = async (filePath: string): Promise<any> => {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
};

/**
 * Writes an object to a JSON file.
 * @param filePath - The path to the JSON file.
 * @param data - The object to write.
 * @returns A promise that resolves when the file is written.
 */
export const writeJsonFile = async (filePath: string, data: any): Promise<void> => {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
};

/**
 * Formats a date to a readable string.
 * @param date - The date to format. Defaults to the current date.
 * @returns A formatted date string.
 */
export const formatDate = (date: Date = new Date()): string => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

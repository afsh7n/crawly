/**
 * Utility functions for formatting extracted data into different formats.
 */

/**
 * Converts an array of objects into a CSV string.
 * @param data - The array of objects to convert.
 * @returns The CSV-formatted string.
 */
export function toCSV(data: Record<string, any>[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
        headers.map((header) => (row[header] !== undefined ? row[header] : '')).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
}

/**
 * Converts data into a JSON string.
 * @param data - The data to convert.
 * @returns The JSON-formatted string.
 */
export function toJSON(data: Record<string, any>): string {
    return JSON.stringify(data, null, 2);
}

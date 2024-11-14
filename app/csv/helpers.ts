import { ConnectionError, InvalidData, InvalidURL } from "@/lib/errors";
import Papa from "papaparse";

/**
 * Fetches CSV data from the URL
 * @param url URL to set
 * @returns CSV data content
 */
export async function fetchCSV(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new ConnectionError("Error to connect getting the CSV data");
    }
    const text = await res.text();
    const data = Papa.parse(text, {
      header: true,
    }).data;

    return data;
  } catch (e) {
    if (e instanceof InvalidURL) {
      throw new InvalidURL(e.message);
    }
  }
}

/**
 * Fetches CSV data from the URL and converts to JSON data string
 * @param url URL to set
 * @returns JSON data string
 */
export async function fetchCSVToJSON(url: string) {
  const results = [] as any[];
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ConnectionError("Error connecting to the server");
    }
    const text = await response.text();
    const dataContent: any = Papa.parse(text, { header: true }).data;
    if (!dataContent || dataContent.length === 0) {
      throw new InvalidData("No data found in the CSV");
    }
    if (dataContent && dataContent.length > 0) {
      let columnNames = Object.keys(dataContent[0]);
      dataContent.forEach((row: any) => {
        let obj = {} as any;
        for (let i = 0; i < columnNames.length; i++) {
          let value = row[columnNames[i]];
          obj[columnNames[i]] = value;
        }
        results.push(obj);
      });
    }

    return JSON.stringify(results, null, 2);
  } catch (e) {
    if (e instanceof InvalidURL) {
      throw new InvalidURL(e.message);
    }
  }
}

/**
 * Converts CSV to JSON
 * @param dataContent CSV data
 * @returns JSON data
 */
export function convertCSVtoJSON(dataContent: any) {
  var results = [] as any[];
  if (dataContent && dataContent.length > 0) {
    let columnNames = Object.keys(dataContent[0]);
    dataContent.forEach((row: any) => {
      let obj = {} as any;
      for (let i = 0; i < columnNames.length; i++) {
        let value = row[columnNames[i]];
        obj[columnNames[i]] = value;
      }
      results.push(obj);
    });
  }
  return JSON.stringify(results, null, 2);
}

/**
 * Reads and parses a CSV file to return data contents
 * @param file CSV file
 * @param callback Callback function to return data
 */
export function parseCSV(file: File, callback: (data: any[]) => void) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target?.result?.toString();
    if (text) {
      const parsedData = Papa.parse(text, {
        header: true,
      }).data;
      callback(parsedData);
    }
  };
  reader.readAsText(file);
}

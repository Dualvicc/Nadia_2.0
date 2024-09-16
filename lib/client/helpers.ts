import { ConnectionError, SendError } from "../errors";

type DataTransformNgsi = {
  type: string;
  values: string;
  description: string;
  tags: string;
};

/**
 * Checks if the string is a JSON
 * @param str JSON string to scan
 * @returns A validation about the scanned JSON
 */
export function isJSON(str: string): boolean {
  try {
    JSON.stringify(JSON.parse(str));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Sends NGSI-LD data converted to JSON data to the server
 * @param url Server URL
 * @param data NGSI-LD data to set
 * @returns Response to the server
 */
export async function sendNGSIJson(url: string, data: any) {
  try {
    const payload = {
      entities: data,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new SendError("Error to create NGSI entities");
    }
    return res;
  } catch (error) {
    throw new ConnectionError("Error to connect to Context Broker");
  }
}

/**
 * Searches a value inside JSON
 * @param json JSON data
 * @param field Field selected
 * @returns A result of the value from a field in a JSON
 */
function searchValue(json: any, field: string): any {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      if (key === field) {
        return value;
      }
      if (typeof value === "object") {
        const result = searchValue(value, field);
        if (result !== undefined) {
          return result;
        }
      }
    }
  }
  return undefined;
}

/**
 * Converts JSON to NGSI-LD
 * @param dataForm Data to be transformed
 * @param attrs Attributes
 * @param json JSON data
 * @returns NGSI-LD array
 */
export function createNgsiLdJson(
  dataForm: DataTransformNgsi,
  attrs: string[],
  json: any
) {
  const ngsiLdArr: any[] = [];
  let count: number = 1;

  if (json.hasOwnProperty("results") && Array.isArray(json.results)) {
    json.results.forEach((result: any) => {
      let ngsiLdObj: any = {};

      attrs.forEach((attr: string) => {
        const value = searchValue(result, attr);
        if (value !== undefined) {
          const attrObj = {
            type: typeof value,
            value: value,
          };
          ngsiLdObj[attr] = attrObj;
        }
      });
      ngsiLdObj = {
        id: `urn:ngsi-ld:${dataForm.type}:${count}`,
        type: dataForm.type,
        ...ngsiLdObj,
        description: {
          type: "string",
          value: dataForm.description,
        },
        tags: {
          type: "Array",
          value: dataForm.tags,
        },
      };
      count++;
      ngsiLdArr.push(ngsiLdObj);
    });
    return ngsiLdArr;
  }

  let ngsiLdObj: any = {};

  attrs.forEach((attr: string) => {
    const value = searchValue(json, attr);
    if (value !== undefined) {
      const attrObj = {
        type: typeof value,
        value: value,
      };
      ngsiLdObj[attr] = attrObj;
    }
  });
  ngsiLdObj = {
    id: `urn:ngsi-ld:${dataForm.type}:${count}`,
    type: dataForm.type,
    ...ngsiLdObj,
    description: {
      type: "string",
      value: dataForm.description,
    },
    tags: {
      type: "Array",
      value: dataForm.tags,
    },
  };
  count++;
  ngsiLdArr.push(ngsiLdObj);

  return ngsiLdArr;
}

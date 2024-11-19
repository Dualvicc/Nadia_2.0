import { SendError } from "@/lib/errors";
import { sanitizeValue } from "@/lib/client/utils";

type DataTransformNgsi = {
  type: string;
  values?: string;
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
 * @returns A response of entity data body for the backend
 */
export async function sendNGSIJson(data: any) {
  const url = `/api/entities`;

  const entities = Array.isArray(data) ? data : [data];
  var response: any;
  // console.log("entities -> " + JSON.stringify(entities));

  for (const entity of entities) {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entity, null, 2),
    });

    if (!response.ok) {
      throw new SendError("Error when creating NGSI entity");
    }
  }

  if ( response && response !== null && response !== undefined ) {
    return response;
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
        let value = searchValue(result, attr);
        if (typeof value === "string") {
          value = sanitizeValue(value);
        }
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
    let value = searchValue(json, attr);
    if (typeof value === "string") {
      value = sanitizeValue(value);
    }
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

import { SendError } from "@/lib/errors";

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

  if (response && response !== null && response !== undefined) {
    return response;
  }
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
  let count = 1;

  const getValueByPath = (obj: any, path: string) => {
    return path
      .split(".")
      .reduce(
        (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
        obj
      );
  };

  const processItem = (item: any) => {
    const ngsiLdObj: any = {};

    attrs.forEach((attr) => {
      const value = getValueByPath(item, attr);
      if (value !== undefined) {
        if (attr === "id") {
          // Preserve original value of 'id' into '_id_' to avoid issues
          ngsiLdObj["_id_"] = {
            type: typeof value === "object" ? "object" : typeof value,
            value: value,
          };
        } else {
          ngsiLdObj[attr] = {
            type: typeof value === "object" ? "object" : typeof value,
            value: value,
          };
        }
      }
    });

    return {
      id: `urn:ngsi-ld:${dataForm.type}:${count++}`,
      type: dataForm.type,
      ...ngsiLdObj,
      description: {
        type: "string",
        value: dataForm.description,
      },
      tags: {
        type: "Array",
        value: dataForm.tags.split(",").map((tag) => tag.trim()),
      },
    };
  };

  if (Array.isArray(json)) {
    json.forEach((item) => {
      ngsiLdArr.push(processItem(item));
    });
  } else {
    ngsiLdArr.push(processItem(json));
  }

  return ngsiLdArr;
}

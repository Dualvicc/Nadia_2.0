import { SendError } from '@/lib/errors';
import { sanitizeValue } from '@/lib/client/utils';

type DataTransformNgsi = {
  type: string;
  values: string;
  description: string;
  tags: string;
  userId: string;
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
  let response: Response | null = null;

  for (const entity of entities) {
    try {
      console.log(`Creating entity: ${entity.id}`);
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entity, null, 2),
      });

      if (response.ok) {
        console.log(`Entity created successfully: ${entity.id}`);
        continue;
      }

      const errorData = await response.json().catch(() => ({}));

      if (
        response.status === 422 &&
        errorData?.error?.includes('Already Exists')
      ) {
        console.warn(
          `Entity already exists, attempting update (PUT): ${entity.id}`
        );

        const putUrl = `${url}/${encodeURIComponent(entity.id)}`;
        response = await fetch(putUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entity, null, 2),
        });

        if (!response.ok) {
          const putError = await response.text();
          throw new Error(
            `Failed to update entity: ${entity.id}. Response: ${putError}`
          );
        }

        console.log(`Entity updated successfully: ${entity.id}`);
      } else {
        throw new Error(
          `POST failed for entity ${entity.id}: ${
            errorData.error || 'Unknown error'
          }`
        );
      }
    } catch (error) {
      console.error(`Error processing entity ${entity.id}:`, error);
    }
  }

  return response;
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
      if (typeof value === 'object') {
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

  const emailPrefix =
    (dataForm.userId?.includes('@')
      ? dataForm.userId.split('@')[0]
      : 'unknown') || 'unknown';

  const sanitizeAttributeName = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  };

  const generateNgsiEntity = (source: any) => {
    const ngsiLdObj: any = {
      id: `urn:ngsi-ld:${emailPrefix}:${dataForm.type}:${count++}`,
      type: dataForm.type,
    };

    attrs.forEach((attr: string) => {
      const sanitizedAttr = sanitizeAttributeName(attr);
      let value = searchValue(source, attr);
      if (typeof value === 'string') value = sanitizeValue(value);

      if (value !== undefined) {
        ngsiLdObj[sanitizedAttr] = {
          type: 'Property',
          value: value,
        };
      }
    });

    ngsiLdObj.description = {
      type: 'Property',
      value: dataForm.description,
    };

    ngsiLdObj.tags = {
      type: 'Property',
      value: dataForm.tags.split(','),
    };

    return ngsiLdObj;
  };

  if (json.hasOwnProperty('results') && Array.isArray(json.results)) {
    json.results.forEach((result: any) => {
      ngsiLdArr.push(generateNgsiEntity(result));
    });
  } else {
    ngsiLdArr.push(generateNgsiEntity(json));
  }

  return ngsiLdArr;
}

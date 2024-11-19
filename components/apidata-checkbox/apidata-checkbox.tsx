import React, { useEffect, useState } from "react";

export default function ApiDataCheckboxes({
  apiData,
  selectedKeys,
  setSelectedKeys,
}: {
  apiData: string;
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);

  const extractUniqueKeys = (data: any, prefix = '') => {
    const keys = new Set<string>();
    const traverse = (obj: any, path: string) => {
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const fullPath = path ? `${path}.${key}` : key;
          keys.add(fullPath);

          const isArray = Array.isArray(obj[key]);
          traverse(isArray ? obj[key][0] : obj[key], fullPath);
        });
      }
    };
  
    traverse(data, prefix);
    return keys;
  };

  useEffect(() => {
    if (apiData) {
      const parsedData = JSON.parse(apiData);
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

      const allKeys : any[] = Array.from(
        dataArray.reduce((acc, item) => {
          const keys = extractUniqueKeys(item);
          keys.forEach((key) => acc.add(key));
          return acc;
        }, new Set<string>())
      );

      setUniqueKeys(allKeys);

      setSelectedKeys((prevSelectedKeys) => {
        if (prevSelectedKeys.size === 0) {
          return new Set(allKeys);
        }
        return prevSelectedKeys;
      });
    }
  }, [apiData, setSelectedKeys]);

  const handleCheckboxChange = (key: string) => {
    setSelectedKeys((prevSelectedKeys) => {
      const newSelectedKeys = new Set(prevSelectedKeys);
      if (newSelectedKeys.has(key)) {
        newSelectedKeys.delete(key);
      } else {
        newSelectedKeys.add(key);
      }
      return newSelectedKeys;
    });
  };

  return (
    <div>
      <h2>{"> API Data Values"}</h2>
      {uniqueKeys.length > 0 ? (
        uniqueKeys.map((key) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedKeys.has(key)}
              onChange={() => handleCheckboxChange(key)}
            />
            <label className="ml-2">
              <strong>{key}</strong>
            </label>
          </div>
        ))
      ) : (
        <strong>No data value available</strong>
      )}
    </div>
  );
}

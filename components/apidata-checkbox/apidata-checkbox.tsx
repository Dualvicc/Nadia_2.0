import React, { useEffect, useState } from "react";

const extractNestedKeys = (obj: any, path = "") => {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const fullPath = path ? `${path}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      result[key] = extractNestedKeys(obj[key], fullPath);
    } else {
      result[key] = null;
    }
  }
  return result;
};

const CheckboxTree = ({
  data,
  path = "",
  selectedKeys,
  handleCheckboxChange,
}: {
  data: Record<string, any>;
  path?: string;
  selectedKeys: Set<string>;
  handleCheckboxChange: (key: string) => void;
}) => {
  return (
    <div>
      {Object.entries(data).map(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;
        const isLeaf = value === null;

        return (
          <div key={fullPath} style={{ marginLeft: "20px" }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedKeys.has(fullPath)}
                onChange={() => handleCheckboxChange(fullPath)}
              />
              <label className="ml-2">{key}</label>
            </div>
            {!isLeaf && (
              <CheckboxTree
                data={value}
                path={fullPath}
                selectedKeys={selectedKeys}
                handleCheckboxChange={handleCheckboxChange}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function ApiDataCheckboxes({
  apiData,
  selectedKeys,
  setSelectedKeys,
}: {
  apiData: string;
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const [nestedKeys, setNestedKeys] = useState<Record<string, any>>({});

  useEffect(() => {
    if (apiData) {
      const parsedData = JSON.parse(apiData);
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      const combinedKeys = dataArray.reduce(
        (acc, item) => ({
          ...acc,
          ...extractNestedKeys(item),
        }),
        {}
      );

      setNestedKeys(combinedKeys);

      const allKeys = new Set<string>();
      const collectKeys = (obj: Record<string, any>, path = "") => {
        for (const key in obj) {
          const fullPath = path ? `${path}.${key}` : key;
          allKeys.add(fullPath);
          if (obj[key] !== null) {
            collectKeys(obj[key], fullPath);
          }
        }
      };
      collectKeys(combinedKeys);
      setSelectedKeys(allKeys);
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
      {Object.keys(nestedKeys).length > 0 ? (
        <CheckboxTree
          data={nestedKeys}
          selectedKeys={selectedKeys}
          handleCheckboxChange={handleCheckboxChange}
        />
      ) : (
        <strong>No data value available</strong>
      )}
    </div>
  );
}

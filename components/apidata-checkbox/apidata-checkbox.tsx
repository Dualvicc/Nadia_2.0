import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

const extractNestedKeys = (obj: any, path = "") => {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const fullPath = path ? `${path}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      result[fullPath] = extractNestedKeys(obj[key], fullPath);
    } else {
      result[fullPath] = null;
    }
  }
  return result;
};

const collectAllKeys = (obj: Record<string, any>, path = ""): string[] => {
  const keys: string[] = [];
  for (const key in obj) {
    const fullPath = path ? `${path}.${key}` : key;
    keys.push(fullPath);
    if (obj[key] !== null) {
      keys.push(...collectAllKeys(obj[key], fullPath));
    }
  }
  return keys;
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
  handleCheckboxChange: (key: string, isChecked: boolean) => void;
}) => {
  const getNodeName = (fullPath: string) => {
    const segments = fullPath.split(".");
    return segments[segments.length - 1];
  };

  return (
    <div>
      {Object.entries(data).map(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;
        const nodeName = getNodeName(key);
        const isChecked = selectedKeys.has(fullPath);

        return (
          <div key={fullPath} style={{ marginLeft: "20px" }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) =>
                  handleCheckboxChange(fullPath, e.target.checked)
                }
              />
              <label className="ml-2">{nodeName}</label>
            </div>
            {value && (
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
  isConfigLoaded,
}: {
  apiData: string;
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  isConfigLoaded: boolean;
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

      if (!isConfigLoaded) {
        const allKeys = new Set<string>(collectAllKeys(combinedKeys));
        setSelectedKeys(allKeys);
      }
    }
  }, [apiData, setSelectedKeys, isConfigLoaded]);

  const handleCheckboxChange = (key: string, isChecked: boolean) => {
    setSelectedKeys((prevSelectedKeys) => {
      const newSelectedKeys = new Set(prevSelectedKeys);
      const updateChildKeys = (
        parentKey: string,
        obj: any,
        isChecked: boolean
      ) => {
        Object.keys(obj).forEach((childKey) => {
          const fullPath = `${parentKey}.${childKey}`;

          if (isChecked) {
            newSelectedKeys.add(fullPath);
          } else {
            newSelectedKeys.delete(fullPath);
          }

          if (obj[childKey] && typeof obj[childKey] === "object") {
            updateChildKeys(fullPath, obj[childKey], isChecked);
          }
        });
      };

      if (isChecked) {
        newSelectedKeys.add(key);
        if (nestedKeys[key]) {
          updateChildKeys(key, nestedKeys[key], true);
        }
      } else {
        newSelectedKeys.delete(key);
        if (nestedKeys[key]) {
          updateChildKeys(key, nestedKeys[key], false);
        }
      }

      return newSelectedKeys;
    });
  };

  return (
    <div>
      <Label className="font-semibold">{"API Data Values"}</Label>
      {Object.keys(nestedKeys).length > 0 ? (
        <CheckboxTree
          data={nestedKeys}
          selectedKeys={selectedKeys}
          handleCheckboxChange={handleCheckboxChange}
        />
      ) : (
        <div className="flex items-center">
          <input type="checkbox" />
          <label className="ml-2">
            {"Some checkbox data is waiting here..."}
          </label>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type SavedConfigDataSummary = {
  configName: string;
  storageKey: string;
};

interface LoadConfigProps {
  handleLoadConfig: (configName: string) => void;
  configType: "api" | "csv" | "form";
}

const SavedConfigs: React.FC<LoadConfigProps> = ({ handleLoadConfig, configType }) => {
  const [savedConfigs, setSavedConfigs] = useState<SavedConfigDataSummary[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {

    const loadConfigs = () => {
      const configs: SavedConfigDataSummary[] = [];
    
      Object.keys(localStorage).forEach((key) => {
        const item = localStorage.getItem(key);
    
        if (item) {
          try {
            const savedConfig = JSON.parse(item);
            if (savedConfig.configType === configType) {
              configs.push({
                configName: savedConfig.configName || "Unnamed Config",
                storageKey: key,
              });
            }
          } catch (e) {
            // console.warn(`Error parsing item with key ${key}:`, e);
          }
        }
      });
    
      setSavedConfigs(configs);

      const initialDisabledState = configs.reduce(
        (acc, config) => ({ ...acc, [config.storageKey]: false }),
        {}
      );
      setDisabledButtons(initialDisabledState);
    };

    if (typeof window !== "undefined") {
      loadConfigs();
    }
  }, [configType]);

  const handleToggleDisable = (key: string) => {
    setDisabledButtons((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleDeleteConfig = (storageKey: string) => {
    localStorage.removeItem(storageKey);
    console.log(`Config ${storageKey} deleted`);
    setSavedConfigs((prevConfigs) =>
      prevConfigs.filter((config) => config.storageKey !== storageKey)
    );
    setDisabledButtons((prevState) => {
      const newState = { ...prevState };
      delete newState[storageKey];
      return newState;
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Saved configs</h2>
      {savedConfigs.length === 0 ? (
        <p className="text-gray-500">No saved configs found for {configType}.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {savedConfigs.map((config) => (
            <div
              key={config.storageKey}
              className="flex gap-1 p-4 border rounded-xl"
            >
              <h1>{config.configName}</h1>
              <Button
                onClick={() => handleLoadConfig(config.storageKey)}
                variant="default"
                disabled={disabledButtons[config.storageKey]}
              >
                {"Edit"}
              </Button>
              <Button
                onClick={() => handleDeleteConfig(config.storageKey)}
                variant="destructive"
                disabled={disabledButtons[config.storageKey]}
              >
                Delete
              </Button>
              <Button
                onClick={() => handleToggleDisable(config.storageKey)}
                variant="outline"
              >
                {disabledButtons[config.storageKey] ? "Enable" : "Disable"}
              </Button>
              <Button
                onClick={() => null}
                variant="default"
                disabled={disabledButtons[config.storageKey]}
              >
                Send data (not implemented yet)
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedConfigs;

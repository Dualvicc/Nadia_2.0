"use client";

import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React, { useState } from "react";
import { SendData } from "@/components/buttons/send-data";
import { apiFetch } from "./helpers";
import ApiDataCheckboxes from "@/components/apidata-checkbox/apidata-checkbox";
import { SaveConfigComponent } from "@/components/config-components/save-config-component";
import SavedConfigs from "@/components/config-components/saved-configs";

export default function Page() {
  const [apiData, setApiData] = useState("");
  const [configData, setConfigData] = useState("");
  const [savedConfigName, setSavedConfigData] = useState("");
  const [ngsildData, setNgsildData] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [errorLoad, setErrorLoad] = useState("");

  const handleLoadConfig = (configName: string) => {
    try {
      const loadedConfig = JSON.parse(localStorage.getItem(configName) || "{}");
      if (!loadedConfig || loadedConfig.configType !== "api") {
        setErrorLoad("This config is NOT for API or doesn't exist.");
        return;
      }

      setIsConfigLoaded(true);
      setConfigData(JSON.stringify(loadedConfig, null, 2));
      setSavedConfigData(loadedConfig.configName);
      setApiUrl(loadedConfig.url || "");
      setSelectedKeys(new Set(loadedConfig.selectedKeys || []));
      setApiData(JSON.stringify(loadedConfig.jsonData || "", null, 2));
      setErrorLoad("");
    } catch (error) {
      setErrorLoad("Error loading configuration: " + error);
    }
  };

  return (
    <div>
      <InputForm
        fetch={apiFetch}
        setData={setApiData}
        setUrl={setApiUrl}
        url={apiUrl}
      />
      <TextAreaContent
        title="Api content (Add/edit data here)"
        placeholder="Api data..."
        data={apiData}
        type="api"
        onChange={setApiData}
      />
      <div className="grid w-full gap-1.5 mb-8">
        <p className="font-semibold text-lg">
          Select data to transform NGSI-LD
        </p>
        <ApiDataCheckboxes
          apiData={apiData}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          isConfigLoaded={isConfigLoaded}
        />
        <SavedConfigs handleLoadConfig={handleLoadConfig} configType="api" />
        <SaveConfigComponent
          configType="api"
          url={apiUrl}
          jsonData={apiData}
          selectedKeys={selectedKeys}
          configData={configData}
          savedConfigName={savedConfigName}
        />
        <DataExtractForm
          apiData={apiData}
          setApiData={setNgsildData}
          selectedKeys={selectedKeys}
        />
      </div>
      <TextAreaContent
        title="Ngsi-ld content"
        placeholder="Ngsi-ld..."
        data={ngsildData}
        type="ngsild"
        readOnly={true}
      />
      <SendData ngsildData={ngsildData} />
    </div>
  );
}

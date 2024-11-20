"use client";

import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React, { useState } from "react";
import { SendData } from "@/components/buttons/send-data";
import { apiFetch } from "./helpers";
import ApiDataCheckboxes from "@/components/apidata-checkbox/apidata-checkbox";
import { SaveConfigComponent } from "@/components/config-components/save-config-component";
import { LoadConfigComponent } from "@/components/config-components/load-config-component";

export default function Page() {
  const [apiData, setApiData] = useState("");
  const [ngsildData, setNgsildData] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [errorLoad, setErrorLoad] = useState("");

  const handleLoadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedConfig = JSON.parse(e.target?.result as string);
        if (loadedConfig.configType !== "api") {
          setErrorLoad("This config file is NOT for api");
          return;
        }

        setIsConfigLoaded(true);
        setSelectedKeys(new Set(loadedConfig.selectedKeys || []));
        setApiData(JSON.stringify(loadedConfig.jsonData || "", null, 2));
        setErrorLoad("");
      } catch (error) {
        setErrorLoad("Error loading configuration: "+ error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <InputForm fetch={apiFetch} setData={setApiData} />
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
        <LoadConfigComponent handleLoadConfig={handleLoadConfig} errorLoad={errorLoad} />
        <SaveConfigComponent
          configType="api"
          jsonData={apiData}
          selectedKeys={selectedKeys}
        />
        <DataExtractForm apiData={apiData} setApiData={setNgsildData} selectedKeys={selectedKeys} />
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

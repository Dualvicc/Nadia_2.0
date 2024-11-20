"use client";

import { SendData } from "@/components/buttons/send-data";
import { CSVDataExtractForm } from "@/components/forms/csv-data-extract-form";
import { InputFileCSV } from "@/components/forms/input-file-csv";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React, { useState } from "react";
import { fetchCSVToJSON } from "./helpers";
import { CSVTable } from "@/components/tables/csv-table";
import ApiDataCheckboxes from "@/components/apidata-checkbox/apidata-checkbox";
import { SaveConfigComponent } from "@/components/config-components/save-config-component";
import { LoadConfigComponent } from "@/components/config-components/load-config-component";

export default function Page() {
  const [jsonData, setJsonData] = useState("");
  const [ngsildData, setNgsildData] = useState("");
  const [csvData, setCsvData] = useState("");
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
        if (loadedConfig.configType !== "csv") {
          setErrorLoad("This config file is NOT for CSV");
          return;
        }

        setIsConfigLoaded(true);
        setSelectedKeys(new Set(loadedConfig.selectedKeys || []));

        setJsonData(JSON.stringify(loadedConfig.jsonData || "", null, 2));
        setCsvData(loadedConfig.csvData || "");
        setErrorLoad("");
      } catch (error) {
        setErrorLoad("Error loading configuration: "+ error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <InputForm fetch={fetchCSVToJSON} setData={setJsonData} />
      <InputFileCSV setCsvData={setCsvData} setJsonData={setJsonData} />
      <CSVTable title="CSV Content" data={csvData} />
      <div className="grid w-full gap-1.5 mb-8">
        <p className="font-semibold text-lg">
          Select Data to Transform to NGSI-LD
        </p>
        <ApiDataCheckboxes
          apiData={jsonData}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          isConfigLoaded={isConfigLoaded}
        />
        <LoadConfigComponent handleLoadConfig={handleLoadConfig} errorLoad={errorLoad} />
        <SaveConfigComponent
          configType="csv"
          jsonData={jsonData}
          csvData={csvData}
          selectedKeys={selectedKeys}
        />
        <CSVDataExtractForm
          apiData={jsonData}
          selectedKeys={selectedKeys}
          setApiData={setNgsildData}
        />
      </div>
      <TextAreaContent
        title="NGSI-LD Content"
        placeholder="NGSI-LD..."
        data={ngsildData}
        type="ngsild"
      />
      <SendData ngsildData={ngsildData} />
    </div>
  );
}

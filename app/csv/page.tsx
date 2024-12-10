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
import SavedConfigs from "@/components/config-components/saved-configs";
import GenericButton from "@/components/buttons/generic-button";

export default function Page() {
  const [configData, setConfigData] = useState("");
  const [savedConfigName, setSavedConfigData] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [ngsildData, setNgsildData] = useState("");
  const [csvData, setCsvData] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [urlCsv, setUrlCsv] = useState("");
  const [errorLoad, setErrorLoad] = useState("");
  const [showSavedConfigs, setShowSavedConfigs] = useState(true);

  const handleLoadConfig = (configName: string) => {
    try {
      const loadedConfig = JSON.parse(localStorage.getItem(configName) || "{}");
      if (!loadedConfig || loadedConfig.configType !== "csv") {
        setErrorLoad("This config is NOT for CSV or doesn't exist.");
        return;
      }

      setIsConfigLoaded(true);
      setConfigData(JSON.stringify(loadedConfig, null, 2));
      setJsonData(JSON.stringify(loadedConfig.jsonData || "", null, 2));
      setCsvData(loadedConfig.csvData);
      setSavedConfigData(loadedConfig.configName);
      setUrlCsv(loadedConfig.url || "");
      setSelectedKeys(new Set(loadedConfig.selectedKeys || []));
      setErrorLoad("");
      setShowSavedConfigs(false);
    } catch (error) {
      setErrorLoad("Error loading configuration: " + error);
    }
  };
  
  const handleNewConfig = () => {
    try {
      setIsConfigLoaded(true);
      setConfigData("");
      setJsonData("");
      setCsvData("");
      setSavedConfigData("");
      setUrlCsv("");
      setSelectedKeys(new Set([]));
      setErrorLoad("");
      setShowSavedConfigs(false);
    } catch (error) {
      setErrorLoad("Error loading new configuration: " + error);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold">CSV</h1>
      <br />
      {showSavedConfigs ? (
        <>
          <div className="flex-col">
            <button
              className="mt-4 mb-2 p-2 bg-cyan-700 text-white rounded-md"
              onClick={() => handleNewConfig()}
            >Add new config
            </button>
          </div>
          <SavedConfigs handleLoadConfig={handleLoadConfig} configType="csv" />
        </>
      ) : (
        <>
          <GenericButton title={"← Back"} onClick={() => setShowSavedConfigs(true)} />
          <br/>
          <br/>
          <InputForm
            fetch={fetchCSVToJSON}
            setData={setJsonData}
            setUrl={setUrlCsv}
            url={urlCsv}
          />
          <InputFileCSV setCsvData={setCsvData} setJsonData={setJsonData} />
          <CSVTable title="CSV Content" data={csvData} />
          <div className="grid w-full gap-1.5 mb-8">
            <p className="font-semibold text-lg">
              Select data to transform to NGSI-LD
            </p>
            <ApiDataCheckboxes
              apiData={jsonData}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              isConfigLoaded={isConfigLoaded}
            />
            <SaveConfigComponent
              configType="csv"
              url={urlCsv}
              jsonData={jsonData}
              csvData={csvData}
              selectedKeys={selectedKeys}
              configData={configData}
              savedConfigName={savedConfigName}
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
          
        </>
      )}
    </div>
  );
}

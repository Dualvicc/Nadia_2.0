import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import { DownloadConfig } from "@/components/config-components/download-config";
import { PreBox } from "@/components/pre-box/pre-box";

export function SaveConfigComponent({
  configData,
  savedConfigName,
  configType,
  url,
  selectedKeys,
  jsonData,
  csvData,
}: {
  configData?: string;
  savedConfigName?: string;
  configType: "api" | "csv" | "form";
  url?: string;
  csvData?: string;
  jsonData: string;
  selectedKeys: Set<string>;
}) {
  const [generatedJson, setGeneratedJson] = useState("");
  const [error, setError] = useState("");
  const [configName, setConfigName] = useState("");

  const saveToLocalStorage = () => {
    if (!jsonData) {
      setError(
        "Unable to generate the configuration, JSON data is not available."
      );
      return;
    }
    if (selectedKeys.size === 0 || !configName) {
      setError(
        "All fields (keys and name) must be filled to generate a configuration."
      );
      return;
    }

    try {
      const parsedData = {
        configName: configName,
        configType: configType,
        url: url || "",
        selectedKeys: Array.from(selectedKeys),
        csvData: configType == "csv" ? csvData : null,
        jsonData: JSON.parse(jsonData),
      };
      const storageKey = `apiConfig:${configName}`;
      localStorage.setItem(storageKey, JSON.stringify(parsedData));
      setGeneratedJson(JSON.stringify(parsedData, null, 2));
      setError("");
      window.location.reload();
    } catch (error) {
      setError("Error saving configuration: " + error);
    }
  };

  return (
    <div id="generateJSONconfigdiv" className="gap-1.5 mb-8">
      <Label
        htmlFor={`generated-jsonconfig-data`}
        className="font-semibold text-lg"
      >
        {"Save config"}
      </Label>
      <br />
      <Label className="font-semibold">Config name:</Label>
      <br />
      <Input
        type="text"
        value={configName || savedConfigName}
        onChange={(e) => setConfigName(e.target.value)}
        className="border p-2 w-full"
        placeholder="Enter a name for the configuration"
      />
      <br />
      <DownloadConfig clickFunction={saveToLocalStorage} generatedJson={generatedJson || configData} configName={configName} />
      <Button className="mr-2 hidden" onClick={saveToLocalStorage}>Save config</Button>
      {error && <p className="text-red-500">{error}</p>}
      <PreBox text={generatedJson || configData} />
    </div>
  );
}

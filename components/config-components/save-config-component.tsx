import { downloadJSON } from "@/lib/client/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SaveConfigComponent({
  configType,
  jsonData,
  csvData,
  selectedKeys,
}: {
  configType: "api" | "csv" | "form";
  jsonData: string;
  csvData?: string;
  selectedKeys: Set<string>;
}) {
  const [generatedJson, setGeneratedJson] = useState("");
  const [error, setError] = useState("");
  const [configName, setConfigName] = useState("");

  const generateJSONconfig = () => {
    if (!csvData && configType === "csv") {
      setError("CSV data must be available to generate a configuration.");
      return;
    }
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
        jsonData: JSON.parse(jsonData),
        csvData: configType == "csv" ? csvData : "",
        selectedKeys: Array.from(selectedKeys),
      };
      setGeneratedJson(JSON.stringify(parsedData, null, 2));
      setError("");
    } catch (error) {
      setError("Error generating JSON config: " + error);
    }
  };

  return (
    <div id="generateJSONconfigdiv" className="grid w-full gap-1.5 mb-8">
      <Label
        htmlFor={`generated-jsonconfig-data`}
        className="font-semibold text-lg"
      >
        {"Save config"}
      </Label>
      <Label className="font-semibold">Config name:</Label>
      <Input
        type="text"
        value={configName}
        onChange={(e) => setConfigName(e.target.value)}
        className="border p-2 w-full"
        placeholder="Enter a name for the configuration"
      />
      <Button onClick={generateJSONconfig}>Generate config</Button>
      {error && <p className="text-red-500">{error}</p>}
      <pre
        aria-placeholder="{config data...}"
        className="mt-6 p-4 border border-gray-300 bg-gray-100 rounded-lg"
      >
        {generatedJson}
      </pre>
      <Button
        onClick={() =>
          downloadJSON(generatedJson, `${configName || "config"}.json`)
        }
        disabled={!generatedJson}
      >
        Download config data
      </Button>
    </div>
  );
}

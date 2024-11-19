import { downloadJSON, filterJSONByKeys } from "@/lib/client/utils";
import { TextAreaContent } from "../textarea-content/textarea-content";
import { Button } from "../ui/button";
import { useState } from "react";

export function GenerateJSONComponent({
  jsonData,
  selectedKeys,
}: {
  jsonData: string;
  selectedKeys: Set<string>;
}) {
  const [generatedJson, setGeneratedJson] = useState("");

  const generateJSON = () => {
    if (!jsonData) return;
    try {
      const parsedData = JSON.parse(jsonData);
      const filteredData = filterJSONByKeys(parsedData, selectedKeys);
      setGeneratedJson(JSON.stringify(filteredData, null, 2));
    } catch (error) {
      console.error("Error parsing or filtering JSON:", error);
    }
  };

  return (
    <div id="generateJSONdiv">
      <Button onClick={generateJSON}>Generate JSON</Button>
      <TextAreaContent
        title="JSON generated"
        placeholder="{JSON data...}"
        data={generatedJson}
        type="json"
        readOnly={true}
      />
      <Button onClick={() => downloadJSON(generatedJson, "data.json")}>Download JSON</Button>
    </div>
  );
}

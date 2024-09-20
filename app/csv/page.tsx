"use client";

import { SendData } from "@/components/buttons/send-data";
import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputFileCSV } from "@/components/forms/input-file-csv";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React, { useState } from "react";
import { fetchCSVToJSON } from "./helpers";
import { CSVTable } from "@/components/tables/csv-table";

export default function Page() {
  const [jsonData, setJsonData] = useState("");
  const [ngsildData, setNgsildData] = useState("");
  const [csvData, setCsvData] = useState("");

  return (
    <div>
      <InputForm fetch={fetchCSVToJSON} setData={setJsonData} />
      <InputFileCSV setCsvData={setCsvData} setJsonData={setJsonData} />
      <CSVTable title="CSV content" data={csvData} />
      <div>
        <p className="font-semibold text-lg">
          Select data to transform ngsi-ld
        </p>
        <DataExtractForm apiData={jsonData} setApiData={setNgsildData} />
      </div>
      <TextAreaContent
        title="Ngsi-ld content"
        placeholder="Ngsi-ld..."
        data={ngsildData}
        type="ngsild"
      />
      <SendData ngsildData={ngsildData} />
    </div>
  );
}

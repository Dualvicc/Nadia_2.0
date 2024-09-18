"use client";

import { SendData } from "@/components/buttons/send-data";
import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React, { useState } from "react";

export default function Page() {
  const [csvData, setCsvData] = useState("");
  const [ngsildData, setNgsildData] = useState("");

  return (
    <div>
      <InputForm setData={setCsvData} />
      <TextAreaContent
        title="CSV content"
        placeholder="Api data..."
        data={csvData}
        type="api"
      />
      <div>
        <p className="font-semibold text-lg">
          Select data to transform ngsi-ld
        </p>
        <DataExtractForm apiData={csvData} setApiData={setNgsildData} />
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

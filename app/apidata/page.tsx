"use client";

import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React, { useEffect, useState } from "react";
import { SendData } from "@/components/buttons/send-data";
import { apiFetch } from "./helpers";

export default function Page() {
  const [apiData, setApiData] = useState("");
  const [ngsildData, setNgsildData] = useState("");

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
      <div>
        <p className="font-semibold text-lg">
          Select data to transform ngsi-ld
        </p>
        <DataExtractForm apiData={apiData} setApiData={setNgsildData} />
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

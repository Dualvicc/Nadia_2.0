import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React from "react";

export default function Page() {
  return (
    <div>
      <InputForm />
      <TextAreaContent
        title="Api content"
        placeholder="Api data..."
        data="test"
        type="api"
      />
      <div>
        <p>Select data to transform ngsi-ld</p>
        <DataExtractForm data="hello" />
      </div>
      <TextAreaContent
        title="Ngsi-ld content"
        placeholder="Ngsi-ld"
        data="test"
        type="ngsild"
      />
    </div>
  );
}

"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { InvalidData } from "@/lib/errors";
import { createNgsiLdJson, isJSON } from "@/lib/client/helpers";

type SendDataProps = {
  entityName: string;
  tags: string;
  apiData: string;
  selectedKeys: Set<string>;
  setApiData: React.Dispatch<React.SetStateAction<string>>;
};


export function TransformData({
  entityName,
  tags,
  apiData,
  selectedKeys,
  setApiData,
}: SendDataProps) {

  function onSubmit() {
    try {
      if (!isJSON(apiData))
        throw new InvalidData(
          "This data is not a JSON. Not posible to extract information"
        );

      const parsedData = JSON.parse(apiData);

      if (selectedKeys.size === 0)
        throw new InvalidData("No keys selected for transformation");

      const ngsi = createNgsiLdJson(
        {
          type: entityName,
          description: "Stuff from " + entityName,
          tags: tags,
        },
        Array.from(selectedKeys),
        parsedData
      );
      setApiData(JSON.stringify(ngsi, null, 2));
    } catch (e) {
      if (e instanceof InvalidData) setApiData(e.message);
    }
  }

  return (
    <Button onClick={onSubmit} type="submit">Transform data</Button>
  );
}

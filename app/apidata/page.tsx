"use client";

import { DataExtractForm } from "@/components/forms/data-extract-form";
import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import { Button } from "@/components/ui/button";
import { sendNGSIJson } from "@/lib/client/helpers";
import { InvalidData } from "@/lib/errors";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [apiData, setApiData] = useState("");
  const [ngsildData, setNgsildData] = useState("");
  const { toast } = useToast();

  async function sendData() {
    try {
      if (!ngsildData) throw new InvalidData("Invalid Data");
      const jsonData: any = JSON.parse(ngsildData);
      const url = ""; // Poner la variable de entorno
      const res = await sendNGSIJson(url, jsonData);
      // const resJson = await res.json();
      // if (res.status === 201) {
      //   setMessage(resJson.message);
      // }
      toast({
        title: "Succesfull message",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
    } catch (e) {
      if (e instanceof Error)
        toast({
          title: e.message,
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
      // if (e instanceof SendError) setMessage(e.message);
      // if (e instanceof ConnectionError) setMessage(e.message);
      // if (e instanceof InvalidURL) setMessage(e.message);
      // if (e instanceof InvalidData) setMessage(e.message);
      // if (e instanceof Error) setMessage(e.message);
    }
  }

  return (
    <div>
      <InputForm setData={setApiData} />
      <TextAreaContent
        title="Api content"
        placeholder="Api data..."
        data={apiData}
        type="api"
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
      />
      <Button type="button" onClick={sendData}>
        Send
      </Button>
    </div>
  );
}

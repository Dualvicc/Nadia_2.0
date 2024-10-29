"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { isJSON, sendNGSIJson } from "@/lib/client/helpers";
import { InvalidData } from "@/lib/errors";
import { toast } from "@/hooks/use-toast";
import { dataTimeText } from "@/lib/client/utils";

export function SendData({ ngsildData }: { ngsildData: string }) {

  async function sendDataToApi() {
    try {
      if (!ngsildData || !isJSON(ngsildData)) {
        throw new InvalidData("Invalid Data");
      }
      const jsonData: any = JSON.parse(ngsildData);
      const res = await sendNGSIJson(jsonData);

      if (!res.ok) {
        throw new Error(`Cannot create NGSI entities`);
      }

      toast({
        title: "Data sent succesfully",
        description: dataTimeText(),
      });
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: e.message,
          description: dataTimeText(),
        });
      }
    }
  }

  return (
    <Button type="button" onClick={sendDataToApi}>
      Send
    </Button>
  );
}

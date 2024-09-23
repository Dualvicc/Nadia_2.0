"use client";

import React from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendNGSIJson } from "@/lib/client/helpers";
import { InvalidData } from "@/lib/errors";

export function SendData({ ngsildData }: { ngsildData: string }) {
  const { toast } = useToast();

  async function sendDataToApi() {
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
    <Button type="button" onClick={sendDataToApi}>
      Send
    </Button>
  );
}

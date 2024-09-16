"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InvalidData } from "@/lib/errors";
import { createNgsiLdJson, isJSON } from "@/lib/client/helpers";

type DataExtractFormProps = {
  apiData: string;
  setApiData: React.Dispatch<React.SetStateAction<string>>;
};

const arrRegex = /^\w+(,\w+)*$/;

const FormSchema = z.object({
  type: z.string().min(2, { message: "Must be 2 or more characters long" }),
  values: z.string().regex(new RegExp(arrRegex), {
    message: "Must be 1 or more items separated only by coma",
  }),
  description: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" }),
  tags: z.string().regex(new RegExp(arrRegex), {
    message: "Must be 1 or more items separated only by coma",
  }),
});

export function DataExtractForm({ apiData, setApiData }: DataExtractFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "",
      values: "",
      description: "",
      tags: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const valuesArr: string[] = data.values.split(",");
      if (!data)
        throw new InvalidData(
          "No data from which information can be extracted"
        );

      if (!isJSON(apiData))
        throw new InvalidData(
          "This data is not a JSON. Not posible to extracted information"
        );

      const ngsi = createNgsiLdJson(data, valuesArr, JSON.parse(apiData));
      setApiData(JSON.stringify(ngsi, null, 2));
    } catch (e) {
      if (e instanceof InvalidData) setApiData(e.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/3 space-y-6 mb-8"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="ParkingSpot"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="values"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Values</FormLabel>
              <FormControl>
                <Input
                  placeholder="Insert value1,value2..."
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="This is a description."
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="Parking,Belgium,Bruge..."
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

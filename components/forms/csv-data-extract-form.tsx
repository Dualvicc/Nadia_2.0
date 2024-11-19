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

type CSVDataExtractFormProps = {
  apiData: string;
  selectedKeys: Set<string>;
  setApiData: React.Dispatch<React.SetStateAction<string>>;
};

const arrRegex = /^\w+(,\w+)*$/;

const FormSchema = z.object({
  type: z.string().min(2, { message: "Must be 2 or more characters long" }),
  description: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" }),
  tags: z.string().regex(new RegExp(arrRegex), {
    message: "Must be 1 or more items separated only by coma",
  }),
});

export function CSVDataExtractForm({
  apiData,
  selectedKeys,
  setApiData,
}: CSVDataExtractFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "",
      description: "",
      tags: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (!data)
        throw new InvalidData(
          "No data from which information can be extracted"
        );

      if (!isJSON(apiData))
        throw new InvalidData(
          "This data is not a JSON. Not posible to extract information"
        );

      const parsedData = JSON.parse(apiData);

      if (selectedKeys.size === 0)
        throw new InvalidData("No keys selected for transformation");

      const ngsi = createNgsiLdJson(
        {
          type: data.type,
          description: data.description,
          tags: data.tags,
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
              <FormLabel>Entity name & type</FormLabel>
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

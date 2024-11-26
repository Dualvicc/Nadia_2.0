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

type InputFormProps = {
  fetch: (url: string) => Promise<any>;
  setData: React.Dispatch<React.SetStateAction<string>>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
};

const FormSchema = z.object({
  url: z.string().url(),
});

export function InputForm({ fetch, setData, setUrl, url }: InputFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
  });

  React.useEffect(() => {
    form.setValue("url", url);
  }, [form, setUrl, url]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const apiData = await fetch(data.url);
    setData(JSON.stringify(apiData, null, 2));
    setUrl(data.url);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-1/3 space-y-6 mb-8"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-lg">
                Upload data
              </FormLabel>
              <FormControl>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    placeholder="https://www.domain.com"
                    {...field}
                    className="bg-white"
                  />
                  <Button type="submit">Submit</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

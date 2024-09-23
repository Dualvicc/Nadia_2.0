"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { convertCSVtoJSON, parseCSV } from "@/app/csv/helpers";
import { Button } from "../ui/button";

const CSV_EXTENSION = ["text/csv"];
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

const InputFileCSVSchema = z.object({
  file: z
    .instanceof(File, { message: "Please upload a file." })
    .refine((file) => file?.size !== 0, "File is blank")
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      if (!file) return false;
      return CSV_EXTENSION.includes(file.type);
    }, "File must be a CSV"),
});

type InputFileCSVProps = {
  setJsonData: React.Dispatch<React.SetStateAction<string>>;
  setCsvData: React.Dispatch<React.SetStateAction<any>>;
};

export function InputFileCSV({ setJsonData, setCsvData }: InputFileCSVProps) {
  const form = useForm<z.infer<typeof InputFileCSVSchema>>({
    resolver: zodResolver(InputFileCSVSchema),
  });

  function onSubmit(data: z.infer<typeof InputFileCSVSchema>) {
    parseCSV(data.file, (content) => {
      setCsvData(content);
      setJsonData(convertCSVtoJSON(content));
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-sm items-center gap-1.5 mb-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    id="csv"
                    type="file"
                    className="bg-white"
                    accept={CSV_EXTENSION[0]}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
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

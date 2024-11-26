"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FieldData = {
  id: number;
  label: string;
  type: string;
  tags: string[];
};

const DynamicForm = () => {
  const methods = useForm();
  const [formName, setFormName] = useState<string>("");
  const [formTags, setFormTags] = useState<string[]>([]);
  const [fields, setFields] = useState<FieldData[]>([
    {
      id: 0,
      label: "",
      type: "text",
      tags: [],
    },
  ]);

  const addField = () => {
    const newFieldIndex = fields.length;
    setFields([
      ...fields,
      {
        id: newFieldIndex,
        label: "",
        type: "text",
        tags: [],
      },
    ]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const saveJsonToLocal = () => {
    const formId = Date.now();
    const structure = {
      id: formId,
      formName: formName,
      tags: formTags,
      data: fields.map((field) => ({
        label: field.label,
        type: field.type,
        tags: field.tags,
      })),
    };

    localStorage.setItem(`form-${formId}`, JSON.stringify(structure));

    setFormName("");
    setFormTags([]);
    setFields([
      {
        id: 0,
        label: "",
        type: "text",
        tags: [],
      },
    ]);
    window.location.reload();
  };

  return (
    <Form {...methods}>
      <form className="p-6 bg-white rounded-lg shadow-md space-y-4">
        <div className="space-y-6">
          <FormItem>
            <FormLabel className="font-semibold mb-1">Form Name</FormLabel>
            <FormControl>
              <Input
                className="border border-gray-300 p-2 rounded-md w-full"
                type="text"
                placeholder="Enter the form name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel className="font-semibold mb-1">Form Tags</FormLabel>
            <FormControl>
              <Input
                className="border border-gray-300 p-2 rounded-md w-full"
                type="text"
                placeholder="Enter tags separated by commas"
                value={formTags.join(", ")}
                onChange={(e) =>
                  setFormTags(
                    e.target.value.split(",").map((tag) => tag.trim())
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className="flex flex-wrap max-h-[400px] gap-12 overflow-y-auto">
            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <div className="border p-4 rounded-lg w-[30rem] bg-gray-50 space-y-4">
                  <FormItem>
                    <FormLabel className="font-semibold mb-1">{`Label for Field ${
                      index + 1
                    }`}</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-300 p-2 rounded-md w-full"
                        type="text"
                        placeholder={`Enter label for Field ${index + 1}`}
                        value={field.label}
                        onChange={(e) =>
                          setFields((prev) =>
                            prev.map((f) =>
                              f.id === field.id
                                ? { ...f, label: e.target.value }
                                : f
                            )
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="font-semibold mb-1">{`Type for Field ${
                      index + 1
                    }`}</FormLabel>
                    <FormControl>
                      <select
                        className="border border-gray-300 p-2 rounded-md w-full"
                        value={field.type}
                        onChange={(e) =>
                          setFields((prev) =>
                            prev.map((f) =>
                              f.id === field.id
                                ? { ...f, type: e.target.value }
                                : f
                            )
                          )
                        }
                      >
                        <option value="text">String</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="date">Date</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="font-semibold mb-1">{`Tags for Field ${
                      index + 1
                    }`}</FormLabel>
                    <FormControl>
                      <Input
                        className="border border-gray-300 p-2 rounded-md w-full"
                        type="text"
                        placeholder="Enter tags separated by commas"
                        value={field.tags.join(", ")}
                        onChange={(e) =>
                          setFields((prev) =>
                            prev.map((f) =>
                              f.id === field.id
                                ? {
                                    ...f,
                                    tags: e.target.value
                                      .split(",")
                                      .map((tag) => tag.trim()),
                                  }
                                : f
                            )
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <Button
                    type="button"
                    onClick={() => removeField(field.id)}
                    variant="destructive"
                  >
                    Remove Field
                  </Button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <Button type="button" onClick={addField} variant="default">
            Add Field
          </Button>
          <Button
            type="button"
            onClick={saveJsonToLocal}
            variant="default"
            className="bg-green-500"
          >
            Save JSON
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DynamicForm;

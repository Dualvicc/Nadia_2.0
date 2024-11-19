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
import { Button } from "@/components/ui/button"; // Usa tu componente de botón personalizado

type FieldData = {
  id: number;
  label: string;
  type: string;
  required: boolean;
};

const DynamicForm = () => {
  const methods = useForm();
  const [fields, setFields] = useState<FieldData[]>([]);
  const [formStructure, setFormStructure] = useState<object[]>([]);

  const addField = () => {
    const newFieldIndex = fields.length;
    setFields([
      ...fields,
      {
        id: newFieldIndex,
        label: "",
        type: "text",
        required: false,
      },
    ]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const saveFormStructure = () => {
    const structure = fields.map((field) => ({
      label: field.label,
      type: field.type,
      required: field.required,
    }));
    setFormStructure(structure);
    console.log("Form Structure:", JSON.stringify(structure, null, 2));
  };

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(() => saveFormStructure())}
        className="p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <div className="border p-4 rounded-lg bg-gray-50 space-y-4">
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
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="date">Date</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel className="font-semibold mb-1">{`Required for Field ${
                    index + 1
                  }`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          setFields((prev) =>
                            prev.map((f) =>
                              f.id === field.id
                                ? { ...f, required: e.target.checked }
                                : f
                            )
                          )
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-gray-600">Required</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <Button
                  type="button"
                  onClick={() => removeField(field.id)}
                  variant="destructive"
                  className="w-full mt-2"
                >
                  Remove Field
                </Button>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex space-x-4 mt-4">
          <Button type="button" onClick={addField} variant="default">
            Add Field
          </Button>
          <Button type="submit" variant="default">
            Save Form Structure
          </Button>
        </div>
      </form>
      <pre className="mt-6 p-4 border border-gray-300 bg-gray-100 rounded-lg">
        {JSON.stringify(formStructure, null, 2)}
      </pre>
    </Form>
  );
};

export default DynamicForm;

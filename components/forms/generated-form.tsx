"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type FieldData = {
  label: string;
  type: string;
  tags?: string[];
};

type GeneratedFormProps = {
  formId: number;
  formName: string;
  fields: FieldData[];
  tags: string[];
};

const GeneratedForm: React.FC<GeneratedFormProps> = ({
  formId,
  formName,
  fields,
  tags,
}) => {
  const methods = useForm();
  const { toast } = useToast();

  const [responses, setResponses] = React.useState<any>(
    fields.reduce((acc, field) => {
      acc[field.label] = [""];
      return acc;
    }, {} as Record<string, string[]>)
  );

  // Cargar respuestas desde localStorage
  React.useEffect(() => {
    const savedFormData = localStorage.getItem(`responses-${formId}`);
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setResponses(parsedData || {});
    }
  }, [formId]);

  const generateZodSchema = () => {
    const schemaObject: Record<string, any> = {};

    fields.forEach((field) => {
      const zodType =
        field.type === "number"
          ? z.number().nonnegative("Value must be a positive number.")
          : field.type === "email"
          ? z.string().email("Please provide a valid email address.")
          : field.type === "date"
          ? z
              .string()
              .refine(
                (val) => !isNaN(Date.parse(val)),
                "Please provide a valid date."
              )
          : z.string().min(1, `${field.label} is required.`);

      schemaObject[field.label] = z.array(zodType).nonempty({
        message: `${field.label} must have at least one value.`,
      });
    });

    return z.object(schemaObject);
  };

  const onSubmit: SubmitHandler<any> = () => {
    const schema = generateZodSchema();

    try {
      schema.parse(responses);

      const result = {
        formId,
        formName,
        fields,
        responses, // Solo se guardan las respuestas
      };

      // Guardar respuestas en localStorage
      localStorage.setItem(`responses-${formId}`, JSON.stringify(responses));

      console.log("Form Submitted with Full Data:", result);

      toast({
        title: "Form Submitted",
        description: "Your responses have been successfully saved.",
        variant: "default",
      });
    } catch (err: any) {
      if (err.errors) {
        err.errors.forEach((error: any) => {
          toast({
            title: "Validation Error",
            description: error.message || "Invalid input.",
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddResponse = (label: string) => {
    setResponses((prev: any) => ({
      ...prev,
      [label]: [...prev[label], ""],
    }));
  };

  const handleRemoveResponse = (label: string, index: number) => {
    setResponses((prev: any) => ({
      ...prev,
      [label]: prev[label].filter((_: void, i: number) => i !== index),
    }));
  };

  const handleResponseChange = (
    label: string,
    index: number,
    value: string
  ) => {
    setResponses((prev: any) => {
      const updatedResponses = [...prev[label]];
      updatedResponses[index] = value;
      return { ...prev, [label]: updatedResponses };
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{formName}</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Tags:</h3>
        <ul className="flex flex-wrap gap-2 mt-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <li
                key={index}
                className="bg-blue-100 text-blue-800 text-sm font-semibold py-1 px-3 rounded-full shadow-md border border-blue-200 hover:bg-blue-200 transition"
              >
                {tag}
              </li>
            ))
          ) : (
            <li className="text-gray-500 italic">No tags available</li>
          )}
        </ul>
      </div>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {fields.map((field, index) => (
            <div
              key={index}
              className="space-y-4 border p-4 rounded-lg bg-gray-50"
            >
              <FormLabel className="text-lg font-semibold">
                {field.label}
              </FormLabel>
              {responses[field.label].map(
                (response: string, responseIndex: number) => (
                  <div key={responseIndex} className="flex items-center gap-4">
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={`Enter ${field.label}`}
                        value={response}
                        onChange={(e) =>
                          handleResponseChange(
                            field.label,
                            responseIndex,
                            e.target.value
                          )
                        }
                        className="w-full"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() =>
                        handleRemoveResponse(field.label, responseIndex)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddResponse(field.label)}
                className="mt-2"
              >
                Add Response
              </Button>
            </div>
          ))}
          <Button type="submit" variant="default" className="mt-4">
            Submit
          </Button>
        </form>
      </Form>

      <div className="mt-6 p-4 border border-gray-300 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Preview of Responses:</h3>
        <pre>{JSON.stringify(responses, null, 2)}</pre>
      </div>
    </div>
  );
};

export default GeneratedForm;

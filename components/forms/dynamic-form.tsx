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

type FieldData = {
  id: number;
  fieldName: string;
  fieldValue: string;
  fieldType: string;
};

const DynamicForm = () => {
  const methods = useForm();
  const [fields, setFields] = useState<FieldData[]>([]);

  const addField = () => {
    const newFieldIndex = fields.length;
    setFields([
      ...fields,
      {
        id: newFieldIndex,
        fieldName: `fieldName-${newFieldIndex}`,
        fieldValue: `fieldValue-${newFieldIndex}`,
        fieldType: `fieldType-${newFieldIndex}`,
      },
    ]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter((field) => field.id !== id));
    methods.unregister(`fieldName-${id}`);
    methods.unregister(`fieldValue-${id}`);
    methods.unregister(`fieldType-${id}`);
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <div className="">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <div className="flex items-center gap-2">
                <FormItem>
                  <FormLabel>{`Field Name ${index + 1}`}</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black"
                      type="text"
                      {...methods.register(field.fieldName, {
                        required: `Field Name ${index + 1} is mandatory`,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>{`Field ${index + 1}`}</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black"
                      type="text"
                      {...methods.register(field.fieldValue, {
                        required: `Field ${index + 1} is mandatory`,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>{`Field Type ${index + 1}`}</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-black"
                      type="text"
                      {...methods.register(field.fieldType, {
                        required: `Field Type ${index + 1} is mandatory`,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  X
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div>
          <button type="button" onClick={addField}>
            Add Field
          </button>
          <button type="submit">Send</button>
        </div>
      </form>
    </Form>
  );
};

export default DynamicForm;

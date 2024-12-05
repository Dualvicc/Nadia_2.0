'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  onSaveEntities?: (entities: any[]) => void;
};

const GeneratedForm: React.FC<GeneratedFormProps> = ({
  formId,
  formName,
  fields,
  tags,
  onSaveEntities,
}) => {
  const methods = useForm();
  const { toast } = useToast();

  const [entities, setEntities] = React.useState<any[]>([]);
  const [resultPreview, setResultPreview] = React.useState<any>({});

  React.useEffect(() => {
    const savedEntities = localStorage.getItem(`entities-${formId}`);
    if (savedEntities) {
      setEntities(JSON.parse(savedEntities));
    }
  }, [formId]);

  React.useEffect(() => {
    setResultPreview({
      formId,
      formName,
      tags,
      fields,
      entities,
    });
  }, [formId, formName, tags, fields, entities]);

  const generateZodSchema = () => {
    const schemaObject: Record<string, any> = {};

    fields.forEach((field) => {
      const zodType =
        field.type === 'number'
          ? z
              .string()
              .refine(
                (val) => !isNaN(Number(val)) && val.trim() !== '',
                'Value must be a valid number and cannot be empty.'
              )
          : field.type === 'email'
          ? z
              .string()
              .email('Please provide a valid email address.')
              .refine((val) => val.trim() !== '', 'Email cannot be empty.')
          : field.type === 'date'
          ? z
              .string()
              .refine(
                (val) => !isNaN(Date.parse(val)) && val.trim() !== '',
                'Please provide a valid date and it cannot be empty.'
              )
          : z
              .string()
              .min(1, `${field.label} is required.`)
              .refine(
                (val) => val.trim() !== '',
                `${field.label} cannot be empty.`
              );

      schemaObject[field.label] = z
        .string()
        .refine((val) => val.trim() !== '', {
          message: `${field.label} cannot be empty.`,
        });
    });

    return z.object(schemaObject);
  };

  const onSubmit: SubmitHandler<any> = () => {
    const schema = generateZodSchema();

    try {
      entities.forEach((entity) => {
        schema.parse(entity);
      });

      localStorage.setItem(`entities-${formId}`, JSON.stringify(entities));

      if (onSaveEntities) {
        onSaveEntities(entities);
      }

      toast({
        title: 'Entities Saved',
        description: 'Your entities have been successfully saved.',
        variant: 'default',
      });
    } catch (err: any) {
      if (err.errors) {
        err.errors.forEach((error: any) => {
          toast({
            title: 'Validation Error',
            description: error.message || 'Invalid input.',
            variant: 'destructive',
          });
        });
      } else {
        toast({
          title: 'Unexpected Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const addNewEntity = () => {
    const newEntity = fields.reduce((acc, field) => {
      acc[field.label] = '';
      return acc;
    }, {} as Record<string, string>);
    setEntities((prev) => [...prev, newEntity]);
  };

  const handleEntityChange = (
    index: number,
    fieldLabel: string,
    value: string
  ) => {
    setEntities((prev) => {
      const updatedEntities = [...prev];
      updatedEntities[index][fieldLabel] = value;
      return updatedEntities;
    });
  };

  const removeEntity = (index: number) => {
    setEntities((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{formName}</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Tags:</h3>
        <ul className="flex flex-wrap gap-2 mt-2">
          {tags.length > 0 ? (
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
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap gap-6 ">
            {entities.map((entity, entityIndex) => (
              <div
                key={entityIndex}
                className="border p-2 rounded-lg bg-gray-50 space-y-4"
              >
                <div className="text-lg font-semibold">
                  Entity {entityIndex + 1}
                </div>
                {fields.map((field) => (
                  <FormItem key={field.label}>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        placeholder={`Enter ${field.label}`}
                        value={entity[field.label]}
                        onChange={(e) =>
                          handleEntityChange(
                            entityIndex,
                            field.label,
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeEntity(entityIndex)}
                >
                  Remove Entity
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button type="button" onClick={addNewEntity} variant="secondary">
              Add Entity
            </Button>
          </div>
          <div className="mt-4">
            <Button type="submit" variant="default">
              Save Entities
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 p-4 border border-gray-300 bg-gray-100 rounded-lg h-96 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent">
        <h3 className="font-semibold mb-2">Preview of JSON Result:</h3>
        <pre>{JSON.stringify(resultPreview, null, 2)}</pre>
      </div>
    </div>
  );
};

export default GeneratedForm;

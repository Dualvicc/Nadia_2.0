'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InvalidData } from '@/lib/errors';
import { createNgsiLdJson } from '@/lib/client/helpers';

type CSVDataExtractFormProps = {
  apiData: string;
  selectedKeys: Set<string>;
  setApiData: React.Dispatch<React.SetStateAction<string>>;
};

const arrRegex = /^\w+(,\w+)*$/;

const FormSchema = z.object({
  type: z.string().min(2, { message: 'Must be 2 or more characters long' }),
  description: z
    .string()
    .min(2, { message: 'Must be 2 or more characters long' }),
  tags: z.string().regex(new RegExp(arrRegex), {
    message: 'Must be 1 or more items separated only by comma',
  }),
});

export function CSVDataExtractForm({
  apiData,
  selectedKeys,
  setApiData,
}: CSVDataExtractFormProps) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? 'unknown-user';

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: '',
      description: '',
      tags: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      if (!data)
        throw new InvalidData(
          'No data from which information can be extracted'
        );

      const parsedData = JSON.parse(apiData);
      const filteredData = parsedData.map((item: any) => {
        const filteredItem: Record<string, any> = {};
        selectedKeys.forEach((key) => {
          if (key in item) filteredItem[key] = item[key];
        });
        return filteredItem;
      });

      const ngsi = createNgsiLdJson(
        { ...data, values: '', userId: userEmail },
        Array.from(selectedKeys),
        filteredData
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
              <FormLabel>Entity type</FormLabel>
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

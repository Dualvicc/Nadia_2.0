import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvalidData } from "@/lib/errors";

type CSVTableProps = {
  title: string;
  data: any;
};

/**
 * Displays a table component to display data
 * @param data Data to display in the table
 * @returns A table component to display data
 */
export function CSVTable({ data, title }: CSVTableProps) {
  let dataArray: any[] = [];
  try {
    if (data != undefined && data != "" && data != null) {
      dataArray = data;
      console.log("dataArray: ", dataArray);
    }
  } catch (error) {
    if (error instanceof InvalidData) {
      throw new InvalidData(error.message);
    }
  }

  const columns = Object.keys(dataArray[0] || {});

  return (
    <div>
      <p className="font-semibold text-lg">{title}</p>
      <div className="w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 overflow-auto h-[40rem] mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataArray.map((row: any, index: any) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell className="font-medium" key={column}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

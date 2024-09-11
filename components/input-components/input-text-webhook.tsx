import { ChangeEventHandler } from "react";
import { Input } from "@/components/ui/input";

/**
 * Displays an input text
 * @param id Id of input
 * @param placeholder Text as placeholder to the input
 * @param width Width of input. It's possible to set a number or text depends of the tailwind width that you can set.
 * @param onChange
 * @returns InputTextSearcher component
 */
export default function InputTextWebhook({
  id,
  placeholder,
  width,
  value,
  onChange,
}: {
  id: string;
  placeholder: string;
  width: number | string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
}) {
  return (
    <Input
      type="text"
      id={id}
      name={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-${width} p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
    />
  );
}

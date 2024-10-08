import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextAreaProps = {
  title?: string;
  placeholder?: string;
  data?: string;
  type: string;
  rows?: number;
};

export function TextAreaContent({
  title,
  placeholder,
  data,
  type,
  rows = 32,
}: TextAreaProps) {
  return (
    <div className="grid w-full gap-1.5 mb-8">
      <Label htmlFor={`${type}-data`} className="font-semibold text-lg">
        {title}
      </Label>
      <Textarea
        className="resize-none bg-white"
        placeholder={placeholder}
        id={`${type}-data`}
        value={data}
        rows={rows}
        readOnly
      />
    </div>
  );
}

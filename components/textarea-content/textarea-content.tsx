import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TextAreaProps = {
  title?: string;
  placeholder?: string;
  data?: string;
  type: string;
  rows?: number;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export function TextAreaContent({
  title,
  placeholder,
  data = "",
  type,
  rows = 32,
  readOnly = false,
  onChange,
}: TextAreaProps) {
  const [text, setText] = useState(data);

  useEffect(() => {
    if (data !== undefined) {
      setText(data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="grid w-full gap-1.5 mb-8">
      <Label htmlFor={`${type}-data`} className="font-semibold text-lg">
        {title}
      </Label>
      <Textarea
        className="resize-none bg-white"
        placeholder={placeholder}
        id={`${type}-data`}
        value={text}
        onChange={handleChange}
        rows={rows}
        readOnly={readOnly}
      />
    </div>
  );
}

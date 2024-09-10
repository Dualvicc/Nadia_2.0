import { InputForm } from "@/components/forms/input-form";
import { TextAreaContent } from "@/components/textarea-content/textarea-content";
import React from "react";

export default function Page() {
  return (
    <div>
      <InputForm />
      <TextAreaContent title="Api content" data="test" type="api" />
    </div>
  );
}

"use client";

import { ErrorText } from "@/components/error-text/error-text";
import InputTextWebhook from "@/components/input-components/input-text-webhook";
import { useState } from "react";
import { isStringBlank, validateInputText } from "@/lib/utils";

export function WebhookComponent() {
  const [webhookValue, setWebhookValue] = useState<string>("");

  const { success, error } = validateInputText(webhookValue);
  const strVoid = isStringBlank(webhookValue);

  return (
    <div className="grid grid-cols-1 grid-rows-3">
      <p className="self-end mb-1.5">Webhook URL:</p>
      <InputTextWebhook
        id="webhookURL"
        placeholder="https://contextbroker:8089"
        value={webhookValue}
        onChange={(e) => setWebhookValue(e.target.value)}
        width={96}
      />
      {!success && !strVoid && (
        <ErrorText text={JSON.parse(error.message)[0].message} />
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createNgsiLdJson } from '@/lib/client/helpers';

type TransformToNgsiLdProps = {
  formId: number;
  formName: string;
  tags: string[];
  fields: any[];
  responses: any;
};

export const TransformToNgsiLd: React.FC<TransformToNgsiLdProps> = ({
  formId,
  formName,
  tags,
  fields,
  responses,
}) => {
  const [ngsiLdData, setNgsiLdData] = useState<any>(null);

  const handleTransform = () => {
    const dataForm = {
      type: formName,
      description: `Generated from form ID: ${formId}`,
      tags: tags.join(','),
      values: responses ? JSON.stringify(responses) : '',
    };

    const ngsiData = createNgsiLdJson(
      dataForm,
      fields.map((f) => f.label),
      {
        results: responses,
      }
    );

    setNgsiLdData(ngsiData);
  };

  return (
    <div>
      <Button onClick={handleTransform} variant="default" className="mb-4 ">
        Transform to NGSI-LD
      </Button>
      {ngsiLdData && (
        <pre className="p-4 border border-gray-300 bg-gray-100 rounded-lg">
          {JSON.stringify(ngsiLdData, null, 2)}
        </pre>
      )}
    </div>
  );
};

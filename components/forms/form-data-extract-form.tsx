'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createNgsiLdJson } from '@/lib/client/helpers';
import { useSession } from 'next-auth/react';

type TransformToNgsiLdProps = {
  formId: number;
  formName: string;
  tags: string[];
  fields: any[];
  responses: any;
  onTransformComplete: (ngsiLdData: string) => void;
};

export const TransformToNgsiLd: React.FC<TransformToNgsiLdProps> = ({
  formId,
  formName,
  tags,
  fields,
  responses,
  onTransformComplete,
}) => {
  const [ngsiLdData, setNgsiLdData] = useState<any>(null);

  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? 'unknown-user';

  const handleTransform = () => {
    const dataForm = {
      type: formName,
      description: `Generated from form ID: ${formId}`,
      tags: tags.join(','),
      values: responses ? JSON.stringify(responses) : '',
      userId: userEmail,
    };

    const ngsiData = createNgsiLdJson(
      dataForm,
      fields.map((f) => f.label),
      {
        results: responses,
      }
    );

    setNgsiLdData(ngsiData);
    onTransformComplete(JSON.stringify(ngsiData));
  };

  return (
    <div>
      <Button onClick={handleTransform} variant="default" className="mb-4">
        Transform to NGSI-LD
      </Button>
      {ngsiLdData ? (
        <pre className="p-4 border border-gray-300 bg-gray-100 rounded-lg h-[60vh] overflow-auto">
          {JSON.stringify(ngsiLdData, null, 2)}
        </pre>
      ) : (
        <div className="p-4 border border-gray-300 bg-gray-50 rounded-lg h-[60vh] overflow-auto text-gray-400">
          Placeholder: NGSI-LD data will appear here.
        </div>
      )}
    </div>
  );
};

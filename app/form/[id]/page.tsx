'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import GeneratedForm from '@/components/forms/generated-form';
import { TransformToNgsiLd } from '@/components/forms/form-data-extract-form';
import { SendData } from '@/components/buttons/send-data';

const DynamicFormPage = () => {
  const { id } = useParams();
  const [formStructure, setFormStructure] = useState<any>(null);
  const [entities, setEntities] = useState<any[]>([]);
  const [ngsiLdData, setNgsiLdData] = useState<any>(null);

  useEffect(() => {
    const savedJson = localStorage.getItem(`form-${id}`);
    const savedEntities = localStorage.getItem(`entities-${id}`);

    if (savedJson) {
      setFormStructure(JSON.parse(savedJson));
    }

    if (savedEntities) {
      setEntities(JSON.parse(savedEntities));
    }
  }, [id]);

  const handleEntitySave = (newEntities: any[]) => {
    setEntities(newEntities);
  };

  const handleNgsiLdTransform = (transformedData: any) => {
    setNgsiLdData(transformedData);
  };

  if (!formStructure) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Form Not Found</h2>
        <p className="text-gray-500">
          The form with ID <strong>{id}</strong> was not found in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-6 bg-white rounded-lg shadow-md">
      <GeneratedForm
        formId={formStructure.id}
        formName={formStructure.formName}
        fields={formStructure.data}
        tags={formStructure.tags}
        onSaveEntities={handleEntitySave}
      />
      {entities.length > 0 && (
        <TransformToNgsiLd
          formId={formStructure.id}
          formName={formStructure.formName}
          tags={formStructure.tags}
          fields={formStructure.data}
          responses={entities}
          onTransformComplete={handleNgsiLdTransform}
        />
      )}
      <div>
        <SendData ngsildData={ngsiLdData} />
      </div>
    </div>
  );
};

export default DynamicFormPage;

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GeneratedForm from "@/components/forms/generated-form";

const DynamicFormPage = () => {
  const { id } = useParams();
  const [formStructure, setFormStructure] = useState<any>(null);

  useEffect(() => {
    const savedJson = localStorage.getItem(`form-${id}`);
    if (savedJson) {
      setFormStructure(JSON.parse(savedJson));
    } else {
      console.warn(`No form found for ID: ${id}`);
    }
  }, [id]);

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
    <div>
      <GeneratedForm
        formId={formStructure.id}
        formName={formStructure.formName}
        fields={formStructure.data}
        tags={formStructure.tags}
      />
    </div>
  );
};

export default DynamicFormPage;

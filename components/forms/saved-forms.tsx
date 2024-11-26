"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type FormDataSummary = {
  id: number;
  formName: string;
};

const SavedForms: React.FC = () => {
  const [savedForms, setSavedForms] = useState<FormDataSummary[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    const forms: FormDataSummary[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("form-")) {
        const savedForm = JSON.parse(localStorage.getItem(key) || "{}");
        forms.push({
          id: savedForm.id,
          formName: savedForm.formName || "Unnamed Form",
        });
      }
    });

    setSavedForms(forms);
  };

  const handleFormClick = (id: number) => {
    router.push(`/form/${id}`);
  };

  const handleDeleteForm = (id: number) => {
    localStorage.removeItem(`form-${id}`);
    console.log(`Form with ID ${id} deleted`);

    setSavedForms((prevForms) => prevForms.filter((form) => form.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Saved Forms</h2>
      {savedForms.length === 0 ? (
        <p className="text-gray-500">No saved forms found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {savedForms.map((form) => (
            <div key={form.id} className="flex gap-1 p-4 border rounded-xl">
              <Button
                onClick={() => handleFormClick(form.id)}
                variant="default"
                className=""
              >
                {form.formName}
              </Button>
              <Button
                onClick={() => handleDeleteForm(form.id)}
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedForms;

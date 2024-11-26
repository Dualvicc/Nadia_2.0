import DynamicForm from "@/components/forms/dynamic-form";
import SavedForms from "@/components/forms/saved-forms";
import { getServerSession } from "next-auth";

const FormPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <DynamicForm />
      </div>
      <div>
        <SavedForms />
      </div>
    </div>
  );
};

export default FormPage;

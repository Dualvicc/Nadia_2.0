import { DocumentPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import IconButton from "@/components/buttons/iconButton";
import {
  createSubscription,
  deleteEntity,
  deleteEntityWithSubscriptions,
} from "@/lib/dataFetch";
import { useState } from "react";
import { Modal } from "@/components/modal/modal";

/**
 * Displays an entity table component to display data
 * @param data Data to display in the table
 * @returns An entity table component to display data
 */
export default function TableEntities({
  data,
  webhookURL,
}: {
  data: any;
  webhookURL: string;
}) {
  const [message, setMessage] = useState<string>("");
  const [entityObj, setEntityObj] = useState<any>(undefined);
  const [isModalOpenDeleteEntity, setIsModalOpenDeleteEntity] =
    useState<boolean>(false);
  const [isModalOpenCreateSubscription, setIsModalOpenCreateSubscription] =
    useState<boolean>(false);

  function handleOpenModalCreateSubscription(entity: any) {
    return () => {
      setMessage(`Do you wish to create this subscription with ${entity.id}?`);
      setEntityObj(entity);
      setIsModalOpenCreateSubscription(true);
    };
  }

  function handleOpenModalDeleteEntity(entity: any) {
    return () => {
      setMessage(`Do you wish to delete this entity: ${entity.id}?`);
      setEntityObj(entity.id);
      setIsModalOpenDeleteEntity(true);
    };
  }

  function handleCloseModalCancel() {
    setIsModalOpenDeleteEntity(false);
    setIsModalOpenCreateSubscription(false);
  }

  async function handleCloseModalCreateSubscription() {
    await createSubscription(entityObj, webhookURL);
    setIsModalOpenCreateSubscription(false);
  }

  async function handleCloseModalDeleteEntity() {
    await deleteEntity(entityObj);
    setIsModalOpenDeleteEntity(false);
  }

  async function handleCloseModalDeleteEntityWithSubscriptions() {
    await deleteEntityWithSubscriptions(entityObj);
    setIsModalOpenDeleteEntity(false);
  }

  let dataArray = [];
  try {
    if (data != undefined && data != "" && data != null) {
      dataArray = data;
    }
  } catch (error) {
    throw new Error("Data not available");
  }

  return (
    <div
      id="tableDataContainer"
      className="w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-auto h-[40rem]"
    >
      <table className="table-auto rounded-lg w-full">
        <thead>
          <tr>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left">
              Entity ID
            </th>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left">
              Entity type
            </th>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left w-32" />
          </tr>
        </thead>
        <tbody>
          {dataArray.map((entity: any, index: number) => (
            <tr className="bg-gray-100 hover:bg-blue-100" key={index}>
              <td className="border border-gray-300 px-2">{entity.id}</td>
              <td className="border border-gray-300 px-2">{entity.type}</td>
              <td className="border border-gray-300 px-2">
                <div className="flex justify-center gap-2 py-2">
                  <IconButton
                    onClick={handleOpenModalCreateSubscription(entity)}
                    icon={DocumentPlusIcon}
                    color="blue"
                  />
                  <IconButton
                    onClick={handleOpenModalDeleteEntity(entity)}
                    icon={TrashIcon}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpenCreateSubscription}
        onClose={handleCloseModalCancel}
        actionButton1={{
          function: handleCloseModalCreateSubscription,
          title: "Create subscription",
        }}
        message={message}
        cancelColorBtn="transparent"
        title="Create subscription"
      />
      <Modal
        isOpen={isModalOpenDeleteEntity}
        onClose={handleCloseModalCancel}
        actionButton1={{
          function: handleCloseModalDeleteEntity,
          title: "Delete entity",
        }}
        actionButton2={{
          function: handleCloseModalDeleteEntityWithSubscriptions,
          title: "Delete entity and subscription",
        }}
        message={message}
        cancelColorBtn="transparent"
        title="Delete entity and subscription"
      />
    </div>
  );
}

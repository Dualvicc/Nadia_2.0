import { DocumentPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  createSubscription,
  deleteEntity,
  deleteEntityWithSubscriptions,
} from "@/app/entities/helpers";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/modal/modal";
import IconButton from "@/components/buttons/iconButton";
import { dataTimeText } from "@/lib/client/utils";
import { toast } from "@/hooks/use-toast";

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
    const res = await createSubscription(entityObj, webhookURL);
    setIsModalOpenCreateSubscription(false);

    if (res.ok) {
      toast({
        title: "Subscription created succesfully",
        description: dataTimeText(),
      });
      window.location.reload();
    }
  }

  async function handleCloseModalDeleteEntity() {
    const res: any = await deleteEntity(entityObj, false);
    setIsModalOpenDeleteEntity(false);

    if (res.ok) {
      toast({
        title: "Entity deleted succesfully",
        description: dataTimeText(),
      });
      window.location.reload();
    }
  }

  async function handleCloseModalDeleteEntityWithSubscriptions() {
    await deleteEntityWithSubscriptions(entityObj, true);
    setIsModalOpenDeleteEntity(false);

    toast({
      title: "Entity with subscriptions deleted succesfully",
      description: dataTimeText(),
    });
    window.location.reload();
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
      <Table className="table-auto rounded-lg w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left">
              Entity ID
            </TableHead>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left">
              Entity type
            </TableHead>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataArray &&
            dataArray.map((entity: any, index: number) => (
              <TableRow className="bg-gray-100 hover:bg-blue-100" key={index}>
                <TableCell className="border border-gray-300 px-2">
                  {entity.id}
                </TableCell>
                <TableCell className="border border-gray-300 px-2">
                  {entity.type}
                </TableCell>
                <TableCell className="border border-gray-300 px-2">
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
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
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

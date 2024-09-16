import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteSubscription } from "@/app/entities/helpers";
import { Modal } from "@/components/modal/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

/**
 * Displays a subscription table component to display data
 * @param data Data to display in the table
 * @returns A subscription table component to display data
 */
export default function TableSubscriptions({ data }: { data: any }) {
  const [message, setMessage] = useState<string>("");
  const [subscriptionObj, setSubscriptionObj] = useState<any>(undefined);

  function handleOpenModalDeleteSubscription(subscription: any) {
    return () => {
      setMessage(
        `Do you wish to delete this subscription: ${subscription.id}?`
      );
      setSubscriptionObj(subscription.id);
    };
  }

  async function handleCloseModalDeleteSubscription() {
    await deleteSubscription(subscriptionObj);
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
              Subscription ID
            </TableHead>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left">
              Descripition
            </TableHead>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left">
              URL
            </TableHead>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left">
              Last notification
            </TableHead>
            <TableHead className="bg-gray-200 border border-gray-300 px-2 text-left w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataArray.map((subscription: any, index: number) => (
            <TableRow className="bg-gray-100 hover:bg-blue-100" key={index}>
              <TableCell className="border border-gray-300 px-2">
                {subscription.id}
              </TableCell>
              <TableCell className="border border-gray-300 px-2">
                {subscription.description}
              </TableCell>
              <TableCell className="border border-gray-300 px-2">
                {subscription.notification.http.url}
              </TableCell>
              <TableCell className="border border-gray-300 px-2">
                {subscription.notification.lastNotification}
              </TableCell>
              <TableCell className="border border-gray-300 px-2 flex justify-center py-2">
                <Modal
                  openFunction={handleOpenModalDeleteSubscription(subscription)}
                  iconBtnModal={TrashIcon}
                  iconBtnModalColor="blue"
                  actionButton1={{
                    function: handleCloseModalDeleteSubscription,
                    title: "Delete subscription",
                  }}
                  message={message}
                  title="Delete subscription"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

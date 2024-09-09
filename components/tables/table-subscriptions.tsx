import { TrashIcon } from "@heroicons/react/24/solid";
import IconButton from "@/components/buttons/iconButton";
import { deleteSubscription } from "@/lib/dataFetch";
import { Modal } from "@/components/modal/modal";
import { useState } from "react";

/**
 * Displays a subscription table component to display data
 * @param data Data to display in the table
 * @returns A subscription table component to display data
 */
export default function TableSubscriptions({ data }: { data: any }) {
  const [message, setMessage] = useState<string>("");
  const [subscriptionObj, setSubscriptionObj] = useState<any>(undefined);
  const [isModalOpenDeleteSubscription, setIsModalOpenDeleteSubscription] =
    useState<boolean>(false);

  function handleOpenModalDeleteSubscription(subscription: any) {
    return () => {
      setMessage(
        `Do you wish to delete this subscription: ${subscription.id}?`
      );
      setSubscriptionObj(subscription.id);
      setIsModalOpenDeleteSubscription(true);
    };
  }

  function handleCloseModalCancel() {
    setIsModalOpenDeleteSubscription(false);
  }

  async function handleCloseModalDeleteSubscription() {
    await deleteSubscription(subscriptionObj);
    setIsModalOpenDeleteSubscription(false);
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
              Subscription ID
            </th>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left">
              Descripition
            </th>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left">
              URL
            </th>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left">
              Last notification
            </th>
            <th className="bg-gray-200 border border-gray-300 px-2 text-left w-20" />
          </tr>
        </thead>
        <tbody>
          {dataArray.map((subscription: any, index: number) => (
            <tr className="bg-gray-100 hover:bg-blue-100" key={index}>
              <td className="border border-gray-300 px-2">{subscription.id}</td>
              <td className="border border-gray-300 px-2">
                {subscription.description}
              </td>
              <td className="border border-gray-300 px-2">
                {subscription.notification.http.url}
              </td>
              <td className="border border-gray-300 px-2">
                {subscription.notification.lastNotification}
              </td>
              <td className="border border-gray-300 px-2 flex justify-center py-2">
                <IconButton
                  onClick={handleOpenModalDeleteSubscription(subscription)}
                  icon={TrashIcon}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpenDeleteSubscription}
        onClose={handleCloseModalCancel}
        actionButton1={{
          function: handleCloseModalDeleteSubscription,
          title: "Delete subscription",
        }}
        message={message}
        title="Delete subscription"
        cancelColorBtn="transparent"
      />
    </div>
  );
}

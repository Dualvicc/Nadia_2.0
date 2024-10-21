"use client";

import { useEffect, useRef, useState } from "react";
import IconButton from "../buttons/iconButton";
import { XMarkIcon } from "@heroicons/react/16/solid";

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  actionButton1?: { function: () => void; title: string };
  actionButton2?: { function: () => void; title: string };
  message: string;
  cancelColorBtn?: "red" | "blue" | "transparent";
  actionColorBtn?: "red" | "blue";
  title?: string;
};

/**
 * Displays a pop-up component
 * @param isOpen Function to display the pop-up
 * @param onClose Function and button title to close the pop-up
 * @param actionButton1 Second function and button title to close the pop-up (optional)
 * @param actionButton2 Third function and button title to close the pop-up (optional)
 * @param message Message to display
 * @param cancelColorBtn Color for cancel button
 * @param actionColorBtn Color for action button
 * @returns A pop-up component
 */
export function Modal({
  isOpen,
  onClose,
  actionButton1: onClose2,
  actionButton2: onClose3,
  message,
  cancelColorBtn = "red",
  actionColorBtn = "blue",
  title = "",
}: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  function handleCloseModal() {
    if (onClose) {
      onClose();
    }
    setIsModalOpen(false);
  }

  function handleCloseModal2() {
    if (onClose2) {
      onClose2.function();
    }
    setIsModalOpen(false);
  }

  function handleCloseModal3() {
    if (onClose3) {
      onClose3.function();
    }
    setIsModalOpen(false);
  }

  const colorVariants = {
    red: "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
    blue: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
  };

  return (
    <>
      <dialog
        ref={modalRef}
        className="rounded-lg pb-4 pt-2 w-full max-w-md max-h-full px-3"
      >
        <div className="grid grid-cols-[1fr_auto] items-center border-b border-gray-600 mb-3 py-2">
          <p className="font-semibold text-lg">{title}</p>
          {onClose && (
            <IconButton
              icon={XMarkIcon}
              onClick={handleCloseModal}
              color={cancelColorBtn}
            />
          )}
        </div>
        <div className="flex flex-col px-4 items-center">
          <p className="mb-8">{message}</p>
          <div className="flex flex-row gap-4 items-center">
            {onClose2 && (
              <button
                type="button"
                onClick={handleCloseModal2}
                className={`text-white ${colorVariants[actionColorBtn]} focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
              >
                {onClose2?.title}
              </button>
            )}
            {onClose3 && (
              <button
                type="button"
                onClick={handleCloseModal3}
                className={`text-white ${colorVariants[actionColorBtn]} focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
              >
                {onClose3?.title}
              </button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

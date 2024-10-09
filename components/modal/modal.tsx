"use client";

import { ForwardRefExoticComponent, RefAttributes, SVGProps, useEffect, useState } from "react";
import IconButton from "@/components/buttons/iconButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ModalProps = {
  openFunction: () => void;
  iconBtnModal: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & {
      title?: string;
      titleId?: string;
  } & RefAttributes<SVGSVGElement>>;
  iconBtnModalColor?: "red" | "blue" | "transparent";
  actionButton1?: { function: () => void; title: string };
  actionButton2?: { function: () => void; title: string };
  message: string;
  actionColorBtn?: "red" | "blue";
  title?: string;
};

/**
 * Displays a pop-up component
 * @param openFunction Function to display the pop-up
 * @param iconBtnModal Icon to set on the button (heroicons)
 * @param iconBtnModalColor Icon button color
 * @param actionButton1 Second function and button title to close the pop-up (optional)
 * @param actionButton2 Third function and button title to close the pop-up (optional)
 * @param message Message to display
 * @param actionColorBtn Color for action button
 * @param title Dialog title
 * @returns A pop-up component
 */
export function Modal({
  openFunction,
  iconBtnModal,
  iconBtnModalColor,
  actionButton1: onClose2,
  actionButton2: onClose3,
  message,
  actionColorBtn = "blue",
  title = "",
}: ModalProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    openFunction();
    setOpen(false);
  }, [openFunction]);

  function handleCloseModal2() {
    if (onClose2) {
      onClose2.function();
      setOpen(false);
    }
  }

  function handleCloseModal3() {
    if (onClose3) {
      onClose3.function();
      setOpen(false);
    }
  }

  const colorVariants = {
    red: "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
    blue: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <IconButton
          icon={iconBtnModal}
          color={iconBtnModalColor}
        />
        </DialogTrigger>
        <DialogContent
          className="rounded-lg pb-4 pt-2 w-full max-w-md max-h-full px-3"
        >
          <DialogHeader className="grid grid-cols-[1fr_auto] items-center border-b border-gray-600 mb-3 py-2">
            <DialogTitle className="font-semibold text-lg">{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col px-4 items-center">
            <DialogDescription className="mb-8">{message}</DialogDescription>
            <DialogFooter className="flex flex-row gap-4 items-center">
              {onClose2 && (
                <Button
                  type="button"
                  onClick={handleCloseModal2}
                  className={`text-white ${colorVariants[actionColorBtn]} focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
                >
                  {onClose2?.title}
                </Button>
              )}
              {onClose3 && (
                <Button
                  type="button"
                  onClick={handleCloseModal3}
                  className={`text-white ${colorVariants[actionColorBtn]} focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center`}
                >
                  {onClose3?.title}
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

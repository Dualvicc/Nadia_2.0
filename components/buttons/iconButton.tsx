import { FC, SVGProps } from "react";
import { Button } from '@/components/ui/button';

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: FC<SVGProps<SVGSVGElement>>;
  color?: "red" | "blue" | "green" | "transparent";
};

/**
 * Displays a Icon button component
 * @param type Type of the button (If not set: "button")
 * @param onClick Function when the button is clicked
 * @param Icon Icon to display alongside the title
 * @returns An Icon button component
 */
export default function IconButton({
  type = "button",
  onClick,
  icon: Icon,
  color = "red",
}: ButtonProps) {
  const colorVariants = {
    red: "text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800",
    blue: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    green:
      "bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800",
    transparent: "bg-inherit rounded-lg text-inherit hover:bg-gray-100",
  };

  return (
    <>
      <Button
        type={type}
        className={`flex font-medium rounded-md text-sm px-2.5 py-2.5 focus:outline-none ${colorVariants[color]}`}
        onClick={onClick}
      >
        <Icon className="w-6" />
      </Button>
    </>
  );
}

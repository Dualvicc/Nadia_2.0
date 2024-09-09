type ButtonProps = {
  title: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Displays a generic button component
 * @param title Title to display on the button
 * @param type Type of the button (If not set: "button")
 * @param onClick Function when the button is clicked
 * @returns A generic button component
 */
export default function GenericButton({
  title,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className="row-start-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-8 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

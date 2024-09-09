/**
 * Displays an error text message
 * @param text Message to display
 * @returns An error text message
 */
export function ErrorText({ text }: { text: string | undefined }) {
  return <p className='text-red-700 text-sm mt-2 pl-2'>{text}</p>;
}

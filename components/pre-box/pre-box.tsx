export function PreBox({ text }: { text?: string }) {
  return (
    <div className="mt-6 p-4 border border-gray-300 bg-gray-100 rounded-lg h-96 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent">
      <pre>{text}</pre>
    </div>
  );
}

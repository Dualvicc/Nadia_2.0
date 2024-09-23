import Image from "next/image";

export default function UserProfile({ user, onSignOut }) {
  return (
    <div className="flex flex-col items-center p-4 bg-black text-white">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <Image src={user.avatar} alt="User avatar" width={64} height={64} />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">i</span>
        </div>
      </div>
      <div className="text-center mb-4">
        <h2 className="font-bold">{user.role}</h2>
        <p>{user.email}</p>
      </div>
      <button
        onClick={onSignOut}
        className="flex items-center bg-transparent border border-white px-4 py-2 rounded"
      >
        <span className="mr-2">→</span>
        Sign Out
      </button>
    </div>
  );
}

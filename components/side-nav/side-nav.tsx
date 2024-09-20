import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { NavLinks } from "./nav-links";

/**
 * Displays a side navigation bar
 * @returns A side navigation bar
 */
export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white border-r border-r-gray-300">
      <div className="flex items-center gap-4 mb-12 md:p-2">
        <GlobeAltIcon className="w-8" />
        <p className="font-semibold">NADIA DTI</p>
      </div>
      <NavLinks />
    </div>
  );
}

import {
  PresentationChartLineIcon,
  DocumentIcon,
  DocumentChartBarIcon,
  RectangleGroupIcon,
  TagIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

export const links = [
  { name: "Dashboard", href: "/", icon: PresentationChartLineIcon },
  { name: "Api", href: "/apidata", icon: DocumentIcon },
  { name: "Csv", href: "/csv", icon: DocumentChartBarIcon },
  { name: "Form", href: "/form", icon: PencilSquareIcon },
  { name: "Entities", href: "/entities", icon: RectangleGroupIcon },
  {
    name: "Subscriptions",
    href: "/subscriptions",
    icon: TagIcon,
  },
];

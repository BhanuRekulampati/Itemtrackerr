import { Link } from "wouter";

interface TabNavigationProps {
  activeTab: "dashboard" | "create" | "items" | "profile";
}

export default function TabNavigation({ activeTab }: TabNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", href: "/" },
    { id: "create", label: "Generate QR Code", href: "/create" },
    { id: "items", label: "Manage Items", href: "/items" },
    { id: "profile", label: "Profile Settings", href: "/profile" }
  ];
  
  return (
    <div className="border-b border-gray-200">
      <div className="flex -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <Link key={tab.id} href={tab.href}>
            <a className={`${
              activeTab === tab.id
                ? "text-primary border-primary border-b-2"
                : "text-gray-500 hover:text-gray-700 border-transparent border-b-2"
            } whitespace-nowrap py-4 px-1 font-medium text-sm ${
              tab.id !== "dashboard" ? "ml-8" : ""
            }`}>
              {tab.label}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

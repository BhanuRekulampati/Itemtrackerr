import { Link } from "wouter";

interface StatCardProps {
  icon: string;
  iconColor: "primary" | "secondary" | "accent";
  title: string;
  value: string;
  linkText: string;
  linkUrl: string;
}

export default function StatCard({
  icon,
  iconColor,
  title,
  value,
  linkText,
  linkUrl,
}: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
  };
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[iconColor]}`}>
            <i className={`${icon} text-xl`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <Link href={linkUrl}>
            <a className="font-medium text-primary hover:text-primary/80">
              {linkText} <i className="ri-arrow-right-line align-middle ml-1"></i>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";

interface QuickActionCardProps {
  icon: string;
  iconColor: "primary" | "secondary" | "accent" | "gray";
  title: string;
  description: string;
  link: string;
}

export default function QuickActionCard({
  icon,
  iconColor,
  title,
  description,
  link,
}: QuickActionCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    gray: "bg-gray-100 text-gray-600",
  };
  
  return (
    <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg shadow hover:shadow-md transition-all">
      <div>
        <span className={`inline-flex items-center justify-center h-12 w-12 rounded-md ${colorClasses[iconColor]}`}>
          <i className={`${icon} text-xl`}></i>
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-base font-medium">
          <Link href={link}>
            <a className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true"></span>
              {title}
            </a>
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <span className="absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
        <i className="ri-arrow-right-line text-xl"></i>
      </span>
    </div>
  );
}

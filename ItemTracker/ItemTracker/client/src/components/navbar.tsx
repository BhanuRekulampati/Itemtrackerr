import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/items", label: "My Items" },
    { href: "/create", label: "Generate QR" },
  ];
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const logout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <i className="ri-qr-code-line text-primary text-3xl mr-2"></i>
                  <span className="font-bold text-xl text-gray-900">QR-Track</span>
                </a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className={`px-3 py-2 text-sm font-medium ${
                    location === item.href
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}>
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
              <Bell className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full ml-3 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="w-full cursor-pointer">Profile Settings</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/items">
                      <a className="w-full cursor-pointer">My Items</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create">
                      <a className="w-full cursor-pointer">Generate QR Code</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <a>
                  <Button>Sign in</Button>
                </a>
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="inline-flex items-center justify-center">
                  <Menu className="h-6 w-6 text-gray-500" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="py-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className="ri-qr-code-line text-primary text-2xl mr-2"></i>
                        <span className="font-bold text-xl text-gray-900">QR-Track</span>
                      </div>
                    </div>
                    
                    {user && (
                      <div className="flex items-center mt-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex flex-col space-y-2">
                    {menuItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a className={`px-3 py-2 rounded-md text-base font-medium ${
                          location === item.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}>
                          {item.label}
                        </a>
                      </Link>
                    ))}
                    
                    <Link href="/profile">
                      <a className="px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        Profile Settings
                      </a>
                    </Link>
                  </div>
                  
                  <div className="mt-auto border-t pt-4">
                    {user ? (
                      <Button onClick={logout} className="w-full" variant="outline">
                        Log out
                      </Button>
                    ) : (
                      <Link href="/auth">
                        <a className="w-full">
                          <Button className="w-full">Sign in</Button>
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Calendar, Pill, Clock, ClipboardList, X, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/auth/signin', label: 'Log In', icon: User },
    { href: '/doctor', label: 'Book Appointments', icon: Calendar },
    { href: '/medicines', label: 'Order Medicine', icon: Pill },
    { href: '/user/myorder', label: 'Order History', icon: Clock },
    { href: '/myappointments', label: 'My Appointments', icon: ClipboardList },
  ];

  const NavLink = ({ href, label, icon: Icon, isMobile = false }) => {
    const isActive = pathname === href;
    const baseClasses = "relative flex items-center gap-2 transition-all duration-200";
    const mobileClasses = isMobile ? "p-3 w-full hover:bg-gray-100 rounded-lg" : "p-2";
    const activeClasses = isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600";

    return (
      <Link href={href} className={`${baseClasses} ${mobileClasses} ${activeClasses}`}>
        <Icon className="w-4 h-4" />
        <span className="font-medium text-sm">{label}</span>
        {isActive && !isMobile && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              HealthHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-6">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile={true} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
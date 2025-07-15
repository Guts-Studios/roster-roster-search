
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Info, BarChart3, Search, Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: "/", icon: Search, label: "Public Records" },
    { to: "/statistics", icon: BarChart3, label: "Statistics" },
    { to: "/about", icon: Info, label: "About" },
  ];

  return (
    <header className="sticky top-0 z-10 w-full bg-inadvertent-dark-cream shadow-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Empty left side for spacing */}
          <div className="hidden md:block"></div>

          {/* Logo in center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="cursor-pointer">
              <img
                src="/logo/logo.webp"
                alt="Logo"
                className="h-10 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>

          {/* Desktop Navigation - moved to right */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navItems.map(({ to, icon: Icon, label }) => (
                  <NavigationMenuItem key={to}>
                    <Link to={to}>
                      <NavigationMenuLink
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 text-sm text-foreground hover:border-2 hover:border-black rounded-md transition-all border-2 border-transparent",
                        )}
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-foreground hover:border-2 hover:border-black border-2 border-transparent transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-inadvertent-dark-cream">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:border-2 hover:border-black rounded-md transition-all border-2 border-transparent block"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

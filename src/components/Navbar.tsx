
import React from "react";
import { Link } from "react-router-dom";
import { Home, Info, BarChart3 } from "lucide-react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-police-blue shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white mr-8">
              Personnel Database
            </h1>
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-police-blue-light rounded-md transition-colors",
                      )}
                    >
                      <Home size={16} />
                      <span>Home</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/statistics">
                    <NavigationMenuLink
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-police-blue-light rounded-md transition-colors",
                      )}
                    >
                      <BarChart3 size={16} />
                      <span>Statistics</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-sm text-white hover:bg-police-blue-light rounded-md transition-colors",
                      )}
                    >
                      <Info size={16} />
                      <span>About</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

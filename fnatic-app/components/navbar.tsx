// import { ConnectWallet } from "@thirdweb-dev/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "./okto/loginButton";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-800">
      <Link
        href="/"
        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-500"
      >
        SmartSwap
      </Link>
      <div className="flex items-center space-x-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`text-black hover:text-gray-600 ${
                  pathname === "/trade" ? "bg-gray-800" : ""
                }`}
              >
                Trade
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Link href="/trade" passHref>
                  <NavigationMenuLink>Trade</NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`text-black hover:text-gray-600 ${
                  pathname === "/explore" ? "bg-gray-800" : ""
                }`}
              >
                Explore
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Link href="/explore" passHref>
                  <NavigationMenuLink>Explore</NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`text-black hover:text-gray-800 ${
                  pathname === "/pools" ? "bg-gray-800" : ""
                }`}
              >
                Pools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <Link href="/pools" passHref>
                  <NavigationMenuLink>Pools</NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
        {/* <ConnectWallet /> */}
        <LoginButton/>
      </div>
    </nav>
  );
}
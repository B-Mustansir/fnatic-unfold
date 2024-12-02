'use client'

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
        <div className="flex space-x-4">
          <NavLink href="/trade" currentPath={pathname}>
            Trade
          </NavLink>
          <NavLink href="/pools" currentPath={pathname}>
            Pools
          </NavLink>
          <NavLink href="/trading-bots" currentPath={pathname}>
            Trading Bots
          </NavLink>
        </div>
        <LoginButton />
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}

function NavLink({ href, currentPath, children }: NavLinkProps) {
  const isActive = currentPath === href;
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}


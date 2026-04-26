"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  BookOpen,
  TrendingUp,
  Laugh,
  FlaskConical,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Session", href: "/session", icon: Dumbbell },
  { label: "Deep Dive", href: "/deep-dive", icon: BookOpen },
  { label: "Progress", href: "/progress", icon: TrendingUp },
  { label: "Memes", href: "/memes", icon: Laugh },
  { label: "Simulation", href: "/simulation", icon: FlaskConical },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-50">
      <div className="px-5 py-6 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-bold leading-tight">
          InTIMId<span className="text-indigo-600 dark:text-indigo-400">ated</span> by Math
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50"
                }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

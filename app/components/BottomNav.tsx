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
  { label: "Sim", href: "/simulation", icon: FlaskConical },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <ul className="flex items-stretch h-16">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center h-full gap-0.5 text-[10px] font-medium transition-colors
                  ${active
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400"
                  }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

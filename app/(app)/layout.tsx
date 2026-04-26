import BottomNav from "@/app/components/BottomNav";
import SideNav from "@/app/components/SideNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideNav />
      <main className="pb-16 md:pb-0 md:ml-56 min-h-dvh">{children}</main>
      <BottomNav />
    </>
  );
}

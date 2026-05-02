import SideNav from "@/app/components/SideNav";
import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import { VoiceProvider } from "@/app/components/VoiceContext";
import { T } from "@/lib/tokens";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <VoiceProvider>
      {/*
       * Mobile  : block container, content flows naturally, bottom nav is fixed
       * Desktop : flex row, fills full viewport height, no body scroll
       */}
      <div className="md:flex md:h-full md:overflow-hidden">

        {/* Sidebar — visible md+, 64px tablet icon rail, 240px lg+ full */}
        <SideNav />

        {/* Right column — stacks TopBar + content area */}
        <div className="flex-1 flex flex-col md:min-h-0 md:overflow-hidden">

          {/* Top bar — desktop only */}
          <TopBar />

          {/*
           * Screen area
           * Mobile  : plain white, content flows
           * Desktop : cream background (#F2EEE4), 32px top/bottom padding,
           *           centres the 420px content card
           */}
          <div className="flex-1 md:overflow-hidden md:flex md:justify-center md:bg-[#F2EEE4] md:py-8">

            {/*
             * Content card
             * Mobile  : full width, no decoration
             * Desktop : capped at 420px, white bg, shadow, subtle radius
             */}
            <div
              className="w-full md:max-w-[420px] md:rounded-sm md:overflow-hidden md:shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
              style={{ background: T.paper }}
            >
              {/*
               * Scroll container
               * Mobile  : natural flow, padded for fixed bottom nav
               * Desktop : fills card height, internal scroll, no scrollbar
               */}
              <div className="pb-16 md:pb-0 md:h-full md:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {children}
              </div>
            </div>

          </div>

          {/* Mobile bottom nav */}
          <BottomNav />

        </div>
      </div>
    </VoiceProvider>
  );
}

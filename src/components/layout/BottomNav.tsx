import { useLocation, useNavigate } from "react-router";
import { Leaf, BookHeart, User, ScrollText, Plus } from "lucide-react";

const tabs = [
  { path: "/gardens", label: "花园", icon: Leaf },
  { path: "/create", label: "新建", icon: Plus },
  { path: "/profile", label: "我的", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const gardenMatch = location.pathname.match(/^\/garden\/([^/]+)/);
  const gardenId = gardenMatch?.[1];

  const tabsWithGarden = gardenId
    ? [
        { path: `/garden/${gardenId}`, label: "花园", icon: Leaf },
        { path: `/garden/${gardenId}/trace`, label: "留痕", icon: Plus },
        { path: `/garden/${gardenId}/timeline`, label: "时光", icon: ScrollText },
        { path: `/garden/${gardenId}/memory-book`, label: "纪念", icon: BookHeart },
        { path: "/profile", label: "我的", icon: User },
      ]
    : tabs;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-[#FFFDF7]/95 backdrop-blur-xl"
      style={{ paddingBottom: "var(--sab, 0px)" }}
    >
      <div className="mx-auto flex max-w-xl items-center justify-around px-2 py-1.5">
        {tabsWithGarden.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 text-[10px] transition ${
                active ? "text-[#596650]" : "text-[#B9B19F]"
              }`}
            >
              <div className={`rounded-full p-1 ${active ? "bg-[#F0EFE8]" : ""}`}>
                <tab.icon size={20} />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

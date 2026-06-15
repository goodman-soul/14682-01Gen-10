import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Megaphone,
  Settings,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteStore } from "@/store/useSiteStore";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "仪表盘", icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: "/orders", label: "订单管理", icon: <ShoppingCart className="w-5 h-5" /> },
  { to: "/inventory", label: "库存管理", icon: <Package className="w-5 h-5" /> },
  { to: "/ads", label: "广告管理", icon: <Megaphone className="w-5 h-5" /> },
];

const bottomNavItems: NavItem[] = [
  { to: "/settings", label: "站点设置", icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC = () => {
  const currentSite = useSiteStore((state) => state.getCurrentSite());

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/60 flex flex-col z-40">
      <div className="p-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: `linear-gradient(135deg, ${currentSite?.themeColor || "#3B82F6"}40, ${currentSite?.themeColor || "#3B82F6"}10)`,
              border: `1px solid ${currentSite?.themeColor || "#3B82F6"}30`,
            }}
          >
            <Store className="w-5 h-5" style={{ color: currentSite?.themeColor || "#3B82F6" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">跨境多店通</h1>
            <p className="text-xs text-slate-500">Multi-Store Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/60">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-slate-700/60 text-slate-200"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

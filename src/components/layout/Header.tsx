import React from "react";
import { Bell, Search, User } from "lucide-react";
import { SiteSelector } from "./SiteSelector";
import { useSiteStore } from "@/store/useSiteStore";

export const Header: React.FC = () => {
  const currentSite = useSiteStore((state) => state.currentSite);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
              style={{
                background: `linear-gradient(180deg, ${currentSite?.themeColor || "#3B82F6"}, ${currentSite?.themeColor || "#3B82F6"}00)`,
              }}
            />
            <SiteSelector />
          </div>

          <div className="hidden md:flex items-center gap-2 ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="搜索订单、商品、广告..."
                className="w-80 pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:bg-slate-800/80 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-3 ml-1 border-l border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-slate-200">运营管理员</div>
              <div className="text-xs text-slate-500">admin@store.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteStore } from "@/store/useSiteStore";
import { SiteConfig } from "@/types";

export const SiteSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentSiteId, sites, setCurrentSite, getCurrentSite } = useSiteStore();
  const currentSite = getCurrentSite();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (site: SiteConfig) => {
    setCurrentSite(site.id);
    setIsOpen(false);
  };

  if (!currentSite) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl",
          "bg-slate-800/80 border border-slate-700/60",
          "hover:bg-slate-700/80 hover:border-slate-600/60",
          "transition-all duration-200",
          "group relative overflow-hidden"
        )}
        style={{
          boxShadow: isOpen
            ? `0 0 20px ${currentSite.themeColor}30`
            : "none",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(135deg, ${currentSite.themeColor}10 0%, transparent 60%)`,
          }}
        />

        <div className="relative flex items-center gap-3">
          <span className="text-2xl">{currentSite.flag}</span>
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-100">
              {currentSite.name}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {currentSite.currency} · {currentSite.language}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl"
          style={{
            background: `linear-gradient(180deg, ${currentSite.themeColor}, ${currentSite.themeColor}00)`,
          }}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
        "absolute top-full left-0 right-0 mt-2 py-2",
        "bg-slate-800/95 backdrop-blur-md border border-slate-700/60",
        "rounded-xl shadow-2xl shadow-black/30",
        "z-50 overflow-hidden",
        "animate-in fade-in slide-in-from-top-2 duration-200"
      )}
          style={{ minWidth: "240px" }}
        >
          <div className="px-3 py-2 text-xs font-medium text-slate-500 border-b border-slate-700/50">
            选择站点市场
          </div>
          <div className="py-1">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSelect(site)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5",
                  "hover:bg-slate-700/50 transition-colors",
                  "relative"
                )}
              >
                <span className="text-xl">{site.flag}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-slate-200">
                  {site.name}
                </div>
                  <div className="text-xs text-slate-500">
                    {site.currency} · {site.language}
                  </div>
                </div>
                {site.status === "active" ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                ) : (
                  <span className="text-xs text-amber-400">配置中</span>
                )}
                {currentSiteId === site.id && (
                  <Check
                    className="w-4 h-4"
                    style={{ color: site.themeColor }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

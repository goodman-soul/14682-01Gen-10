import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SiteConfig, ConfigIssue } from "@/types";
import { sites, getSiteById } from "@/data/sites";

interface SiteState {
  currentSiteId: string;
  sites: SiteConfig[];
  currentSite: SiteConfig | undefined;
  setCurrentSite: (siteId: string) => void;
  checkSiteConfig: (siteId: string) => { valid: boolean; issues: ConfigIssue[] };
  getSiteIssues: (siteId: string) => ConfigIssue[];
}

const findSiteById = (siteId: string, siteList: SiteConfig[]) => {
  return siteList.find((s) => s.id === siteId);
};

export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      currentSiteId: "us",
      sites: sites,
      currentSite: findSiteById("us", sites),
      setCurrentSite: (siteId: string) => {
        const site = findSiteById(siteId, get().sites);
        set({ currentSiteId: siteId, currentSite: site });
      },
      checkSiteConfig: (siteId: string) => {
        const site = getSiteById(siteId);
        if (!site) {
          return {
            valid: false,
            issues: [
              {
                type: "other",
                severity: "error",
                message: "站点配置不存在",
              },
            ],
          };
        }

        const issues: ConfigIssue[] = [];

        if (!site.logistics.enabled || site.logistics.providers.length === 0) {
          issues.push({
            type: "logistics",
            severity: "warning",
            message: "物流配置未完成，请配置物流服务商",
            action: "去配置物流",
            actionLink: "/settings",
          });
        }

        if (!site.tax.enabled) {
          issues.push({
            type: "tax",
            severity: "warning",
            message: "税务信息待完善，可能影响订单税费计算",
            action: "完善税务信息",
            actionLink: "/settings",
          });
        }

        site.missingConfigs.forEach((config) => {
          issues.push({
            type: "other",
            severity: "warning",
            message: config,
          });
        });

        return {
          valid: issues.filter((i) => i.severity === "error").length === 0,
          issues,
        };
      },
      getSiteIssues: (siteId: string) => {
        return get().checkSiteConfig(siteId).issues;
      },
    }),
    {
      name: "site-storage",
      partialize: (state) => ({ currentSiteId: state.currentSiteId }),
    }
  )
);

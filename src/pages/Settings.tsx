import React from "react";
import {
  Settings as SettingsIcon,
  Globe,
  DollarSign,
  Truck,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSiteStore } from "@/store/useSiteStore";
import { sites } from "@/data/sites";

const Settings: React.FC = () => {
  const { currentSiteId, setCurrentSite, checkSiteConfig } = useSiteStore();

  const configSections = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "站点基本信息",
      description: "站点名称、国家、语言设置",
      status: "complete" as const,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "币种设置",
      description: "货币类型、符号、格式",
      status: "complete" as const,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "物流配置",
      description: "物流服务商、运费、时效",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "税务设置",
      description: "税率、税务说明",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">站点设置</h1>
          <p className="text-slate-400 mt-1">管理各站点的配置信息和运营配置</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            站点列表
          </CardTitle>
            <p className="text-sm text-slate-400 mt-1">
            选择要管理的站点
          </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {sites.map((site) => {
              const { valid, issues } = checkSiteConfig(site.id);
              const isSelected = currentSiteId === site.id;

              return (
                <button
                  key={site.id}
                  onClick={() => setCurrentSite(site.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isSelected
                      ? "bg-blue-500/15 border border-blue-500/30"
                      : "bg-slate-800/30 border border-transparent hover:bg-slate-800/60 hover:border-slate-700/50"
                  }`}
                >
                  <span className="text-2xl">{site.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-slate-200">
                      {site.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {site.currency} · {site.language}
                    </div>
                  </div>
                  {site.status === "active" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>配置状态</CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                当前站点的配置完整性
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {configSections.map((section, index) => {
                  const currentSite = sites.find(
                    (s) => s.id === currentSiteId
                  );
                  let status: "complete" | "warning" | "error" = "complete";

                  if (currentSite) {
                    if (index === 2 && !currentSite.logistics.enabled) {
                      status = "warning";
                    }
                    if (index === 3 && !currentSite.tax.enabled) {
                      status = "warning";
                    }
                  }

                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-lg ${section.bgColor}`}>
                          <span className={section.color}>
                            {section.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-200">
                            {section.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {section.description}
                          </p>
                        </div>
                        {status === "complete" ? (
                          <Badge variant="success" size="sm">
                            已配置
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            待完善
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>站点信息详情
              </CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                当前选中站点的详细配置
              </p>
            </CardHeader>
            <CardContent>
              {(() => {
                const site = sites.find((s) => s.id === currentSiteId);
                if (!site) return null;

                return (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-700/50">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center text-4xl">
                        {site.flag}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-100">
                          {site.name}
                        </h3>
                        <p className="text-slate-400">
                          {site.country}
                        </p>
                      </div>
                      <Badge
                        variant={
                          site.status === "active"
                            ? "success"
                            : "warning"
                        }
                        className="ml-auto"
                      >
                        {site.status === "active"
                          ? "运营中"
                          : "配置中"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-800/30">
                        <div className="text-sm text-slate-500 mb-1">
                          货币
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                          {site.currency} ({site.currencySymbol})
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/30">
                        <div className="text-sm text-slate-500 mb-1">
                          语言
                        </div>
                        <div className="text-lg font-semibold text-slate-200">
                          {site.language}
                        </div>
                      </div>
                    </div>

                    {site.logistics.enabled && (
                      <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                        <div className="flex items-center gap-2 text-purple-400 mb-2">
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">物流配置</span>
                        </div>
                        <div className="space-y-1 text-sm text-slate-300">
                          <p>
                            服务商:{" "}
                            {site.logistics.providers.join(", ")}
                          </p>
                          <p>时效: {site.logistics.estimatedDays}</p>
                          <p className="text-slate-400">
                            {site.logistics.tips}
                          </p>
                        </div>
                      </div>
                    )}

                    {site.tax.enabled && (
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">税务配置</span>
                        </div>
                        <div className="space-y-1 text-sm text-slate-300">
                          <p>税率: {(site.tax.rate * 100).toFixed(0)}%</p>
                          <p className="text-slate-400">
                            {site.tax.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {site.missingConfigs.length > 0 && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium">待完善配置</span>
                        </div>
                        <ul className="space-y-1">
                          {site.missingConfigs.map((config, i) => (
                            <li
                              key={i}
                              className="text-sm text-amber-300 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              {config}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

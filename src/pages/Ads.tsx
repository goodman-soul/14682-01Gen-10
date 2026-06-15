import React, { useState } from "react";
import {
  Search,
  Megaphone,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointerClick,
  ShoppingBag,
  Play,
  Pause,
  Calendar,
  BarChart3,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSiteStore } from "@/store/useSiteStore";
import { formatCurrencySymbol } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { getAdCampaignsBySite } from "@/data/ads";
import { AdStatus } from "@/types";

const Ads: React.FC = () => {
  const currentSite = useSiteStore((state) => state.currentSite);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdStatus | "all">("all");

  if (!currentSite) return null;

  const allCampaigns = getAdCampaignsBySite(currentSite.id);

  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = allCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = allCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = allCampaigns.reduce(
    (sum, c) => sum + c.impressions,
    0
  );
  const totalClicks = allCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = allCampaigns.reduce(
    (sum, c) => sum + c.conversions,
    0
  );
  const totalRevenue = allCampaigns.reduce((sum, c) => sum + c.revenue, 0);

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cvr = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const roas = totalSpent > 0 ? totalRevenue / totalSpent : 0;

  const stats = [
    {
      label: "总预算",
      value: formatCurrencySymbol(totalBudget, currentSite.currencySymbol),
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "已消耗",
      value: formatCurrencySymbol(totalSpent, currentSite.currencySymbol),
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "展示次数",
      value: totalImpressions.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "点击率",
      value: `${ctr.toFixed(2)}%`,
      icon: <MousePointerClick className="w-5 h-5" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  const extraStats = [
    {
      label: "转化数",
      value: totalConversions.toLocaleString(),
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      label: "转化率",
      value: `${cvr.toFixed(2)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "广告收入",
      value: formatCurrencySymbol(totalRevenue, currentSite.currencySymbol),
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "ROAS",
      value: `${roas.toFixed(2)}x`,
      icon: <Megaphone className="w-5 h-5" />,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
  ];

  const getStatusBadge = (status: AdStatus) => {
    const config: Record<AdStatus, { label: string; variant: any; icon: React.ReactNode }> = {
      active: {
        label: "投放中",
        variant: "success",
        icon: <Play className="w-3 h-3" />,
      },
      paused: {
        label: "已暂停",
        variant: "warning",
        icon: <Pause className="w-3 h-3" />,
      },
      ended: {
        label: "已结束",
        variant: "default",
        icon: <Calendar className="w-3 h-3" />,
      },
    };
    return config[status];
  };

  const statusTabs = [
    { value: "all", label: "全部" },
    { value: "active", label: "投放中" },
    { value: "paused", label: "已暂停" },
    { value: "ended", label: "已结束" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">广告管理</h1>
          <p className="text-slate-400 mt-1">
            <span className="text-xl mr-2">{currentSite.flag}</span>
            {currentSite.name} 广告活动概览
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <h3 className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {extraStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/30">
            <CardContent className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <h3 className={`text-lg font-semibold ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>广告活动</CardTitle>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="搜索广告活动..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value as AdStatus | "all")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === tab.value
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">
                  ({tab.value === "all"
                    ? allCampaigns.length
                    : allCampaigns.filter((c) => c.status === tab.value).length})
                </span>
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign) => {
              const statusInfo = getStatusBadge(campaign.status);
              const budgetUsed = (campaign.spent / campaign.budget) * 100;
              const ctr =
                campaign.impressions > 0
                  ? (campaign.clicks / campaign.impressions) * 100
                  : 0;
              const cvr =
                campaign.clicks > 0
                  ? (campaign.conversions / campaign.clicks) * 100
                  : 0;
              const roas =
                campaign.spent > 0 ? campaign.revenue / campaign.spent : 0;

              return (
                <div
                  key={campaign.id}
                  className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {campaign.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(campaign.startDate)} -{" "}
                        {formatDate(campaign.endDate)}
                      </div>
                    </div>
                    <Badge variant={statusInfo.variant} size="sm">
                      <span className="flex items-center gap-1">
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>预算使用</span>
                      <span className="text-slate-400">
                        {formatCurrencySymbol(campaign.spent, currentSite.currencySymbol)} /{" "}
                        {formatCurrencySymbol(campaign.budget, currentSite.currencySymbol)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          campaign.status === "active"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-slate-600"
                        }`}
                        style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-700/40">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-400">
                        {campaign.impressions.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">展示</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-emerald-400">
                        {campaign.clicks.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">点击</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-400">
                        {campaign.conversions}
                      </div>
                      <div className="text-xs text-slate-500">转化</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-700/40">
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">
                        点击率
                      </div>
                      <div className="text-sm font-medium text-amber-400">
                        {ctr.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">
                        ROAS
                      </div>
                      <div className="text-sm font-medium text-pink-400">
                        {roas.toFixed(2)}x
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">暂无广告活动</p>
              <p className="text-sm mt-1">创建您的第一个广告活动</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Ads;

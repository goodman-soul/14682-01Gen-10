import React from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Package,
  Megaphone,
  ArrowRight,
  Clock,
  Truck,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSiteStore } from "@/store/useSiteStore";
import { formatCurrencySymbol } from "@/utils/currency";
import { getOrdersBySite } from "@/data/orders";
import { getLowStockItems, getInventoryBySite } from "@/data/inventory";
import { getAdCampaignsBySite } from "@/data/ads";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentSite = useSiteStore((state) => state.getCurrentSite());

  if (!currentSite) return null;

  const siteOrders = getOrdersBySite(currentSite.id);
  const lowStockItems = getLowStockItems(currentSite.id);
  const inventoryItems = getInventoryBySite(currentSite.id);
  const adCampaigns = getAdCampaignsBySite(currentSite.id);

  const todayRevenue = siteOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  const totalAdSpent = adCampaigns.reduce((sum, c) => sum + c.spent, 0);

  const stats = [
    {
      title: "今日订单",
      value: siteOrders.length.toString(),
      change: "+12.5%",
      positive: true,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "销售额",
      value: formatCurrencySymbol(todayRevenue, currentSite.currencySymbol),
      change: "+8.3%",
      positive: true,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "库存预警",
      value: lowStockItems.length.toString(),
      change: "需补货",
      positive: false,
      icon: <Package className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "广告消耗",
      value: formatCurrencySymbol(totalAdSpent, currentSite.currencySymbol),
      change: "活跃 " + adCampaigns.filter((c) => c.status === "active").length + " 个",
      positive: true,
      icon: <Megaphone className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  const quickActions = [
    {
      title: "查看订单",
      description: "管理所有订单状态",
      icon: <FileText className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-500",
      onClick: () => navigate("/orders"),
    },
    {
      title: "库存管理",
      description: "查看和更新库存",
      icon: <Package className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
      onClick: () => navigate("/inventory"),
    },
    {
      title: "广告投放",
      description: "管理广告活动",
      icon: <Megaphone className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      onClick: () => navigate("/ads"),
    },
    {
      title: "物流追踪",
      description: "查看物流状态",
      icon: <Truck className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      onClick: () => navigate("/orders"),
    },
  ];

  const recentOrders = siteOrders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: "待付款", variant: "warning" },
      paid: { label: "已付款", variant: "info" },
      shipped: { label: "运输中", variant: "purple" },
      delivered: { label: "已送达", variant: "success" },
      cancelled: { label: "已取消", variant: "error" },
    };
    const info = statusMap[status] || { label: status, variant: "default" };
    return <Badge variant={info.variant} size="sm">{info.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">运营仪表盘</h1>
          <p className="text-slate-400 mt-1">
            <span className="text-xl mr-2">{currentSite.flag}</span>
            {currentSite.name} · 实时数据概览
          </p>
        </div>
        <Badge variant="success" size="md" pulse>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
          站点正常运行
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card key={index} hover glow className="relative overflow-hidden">
            <div
              className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${stat.color}`}
            />
            <CardContent className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-slate-100">
                    {stat.value}
                  </h3>
                </div>
                <div
                  className={`p-3 rounded-xl ${stat.bgColor}`}
                  style={{ color: currentSite.themeColor }}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.positive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stat.positive ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group relative p-5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 text-left overflow-hidden"
          >
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`}
            />
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}
            >
              {action.icon}
            </div>
            <h4 className="text-slate-100 font-semibold mb-1">{action.title}</h4>
            <p className="text-sm text-slate-400">{action.description}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>最近订单</CardTitle>
              <p className="text-sm text-slate-400 mt-1">最新的订单动态</p>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-xl">
                      {order.items[0]?.image || "📦"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">
                        {order.orderNo}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {order.customerName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-100">
                      {formatCurrencySymbol(order.amount, currentSite.currencySymbol)}
                    </div>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>库存预警</CardTitle>
            <p className="text-sm text-slate-400 mt-1">需要补货的商品</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.image}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-200">
                        {item.productName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.sku}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-amber-400">
                      {item.available}
                    </div>
                    <div className="text-xs text-slate-500">可用库存</div>
                  </div>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>库存状态良好</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>站点信息</CardTitle>
            <p className="text-sm text-slate-400 mt-1">当前站点配置详情</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-xs text-slate-500 mb-1">币种</div>
                <div className="text-slate-200 font-medium">
                  {currentSite.currency} ({currentSite.currencySymbol})
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-xs text-slate-500 mb-1">语言</div>
                <div className="text-slate-200 font-medium">
                  {currentSite.language}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-xs text-slate-500 mb-1">物流状态</div>
                <div className="text-slate-200 font-medium">
                  {currentSite.logistics.enabled ? (
                    <span className="text-emerald-400">已配置</span>
                  ) : (
                    <span className="text-amber-400">待配置</span>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/40">
                <div className="text-xs text-slate-500 mb-1">税务配置</div>
                <div className="text-slate-200 font-medium">
                  {currentSite.tax.enabled ? (
                    <span className="text-emerald-400">
                      {(currentSite.tax.rate * 100).toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-amber-400">待配置</span>
                  )}
                </div>
              </div>
            </div>

            {currentSite.logistics.enabled && (
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="text-xs text-blue-400 mb-1">物流提示</div>
                <div className="text-sm text-slate-300">
                  {currentSite.logistics.tips}
                </div>
              </div>
            )}

            {currentSite.tax.enabled && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-xs text-emerald-400 mb-1">税务说明</div>
                <div className="text-sm text-slate-300">
                  {currentSite.tax.description}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>广告活动概览</CardTitle>
            <p className="text-sm text-slate-400 mt-1">正在进行的广告活动</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {adCampaigns
              .filter((c) => c.status === "active")
              .slice(0, 4)
              .map((campaign) => {
                const budgetUsed = (campaign.spent / campaign.budget) * 100;
                return (
                  <div
                    key={campaign.id}
                    className="p-3 rounded-xl bg-slate-800/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-200">
                        {campaign.name}
                      </span>
                      <Badge variant="info" size="sm">
                        {campaign.status === "active" ? "投放中" : "已暂停"}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>
                        已消耗 {formatCurrencySymbol(campaign.spent, currentSite.currencySymbol)}
                      </span>
                      <span>
                        预算 {formatCurrencySymbol(campaign.budget, currentSite.currencySymbol)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

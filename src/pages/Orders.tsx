import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Clock,
  DollarSign,
  Truck,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSiteStore } from "@/store/useSiteStore";
import { formatCurrencySymbol } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { getOrdersBySite } from "@/data/orders";
import { OrderStatus } from "@/types";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const currentSite = useSiteStore((state) => state.currentSite);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!currentSite) return null;

  const allOrders = getOrdersBySite(currentSite.id);

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusConfig = (status: OrderStatus) => {
    const config: Record<OrderStatus, { label: string; variant: any; icon: React.ReactNode }> = {
      pending: {
        label: "待付款",
        variant: "warning",
        icon: <Clock className="w-3.5 h-3.5" />,
      },
      paid: {
        label: "已付款",
        variant: "info",
        icon: <DollarSign className="w-3.5 h-3.5" />,
      },
      shipped: {
        label: "运输中",
        variant: "purple",
        icon: <Truck className="w-3.5 h-3.5" />,
      },
      delivered: {
        label: "已送达",
        variant: "success",
        icon: <Package className="w-3.5 h-3.5" />,
      },
      cancelled: {
        label: "已取消",
        variant: "error",
        icon: <Clock className="w-3.5 h-3.5" />,
      },
    };
    return config[status];
  };

  const statusTabs = [
    { value: "all", label: "全部" },
    { value: "pending", label: "待付款" },
    { value: "paid", label: "已付款" },
    { value: "shipped", label: "运输中" },
    { value: "delivered", label: "已送达" },
    { value: "cancelled", label: "已取消" },
  ];

  const stats = [
    { label: "总订单数", value: allOrders.length, color: "text-blue-400" },
    {
      label: "待处理",
      value: allOrders.filter((o) => o.status === "pending" || o.status === "paid").length,
      color: "text-amber-400",
    },
    {
      label: "已完成",
      value: allOrders.filter((o) => o.status === "delivered").length,
      color: "text-emerald-400",
    },
    {
      label: "总销售额",
      value: formatCurrencySymbol(
        allOrders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0),
        currentSite.currencySymbol
      ),
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">订单管理</h1>
          <p className="text-slate-400 mt-1">
            <span className="text-xl mr-2">{currentSite.flag}</span>
            {currentSite.name} 订单列表
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="py-4">
            <CardContent>
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>订单列表</CardTitle>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="搜索订单号、客户名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:bg-slate-700/80 transition-all"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-300 hover:bg-slate-700/80 hover:border-slate-500 transition-all">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value as OrderStatus | "all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === tab.value
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs opacity-60">
                  ({tab.value === "all"
                    ? allOrders.length
                    : allOrders.filter((o) => o.status === tab.value).length})
                </span>
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    订单号
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    客户
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {paginatedOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-200">
                          {order.orderNo}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {order.items.length} 件商品
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-sm font-medium text-slate-200">
                            {order.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm text-slate-200">
                              {order.customerName}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {order.shippingAddress.city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-semibold text-slate-100">
                          {formatCurrencySymbol(order.amount, currentSite.currencySymbol)}
                        </div>
                        {order.taxInfo && (
                          <div className="text-xs text-slate-500">
                            含税费 {formatCurrencySymbol(order.taxInfo.amount, currentSite.currencySymbol)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusConfig.variant} size="sm">
                          <span className="flex items-center gap-1.5">
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-slate-300">
                          {formatDateTime(order.createdAt, "zh-CN")}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                          查看
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paginatedOrders.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">暂无订单</p>
              <p className="text-sm mt-1">尝试调整筛选条件</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
              <div className="text-sm text-slate-500">
                显示 {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} 条，
                共 {filteredOrders.length} 条
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

import React, { useState } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingDown,
  Warehouse,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSiteStore } from "@/store/useSiteStore";
import { getInventoryBySite, getLowStockItems } from "@/data/inventory";
import { formatRelativeTime } from "@/utils/date";
import { formatCurrencySymbol } from "@/utils/currency";

const Inventory: React.FC = () => {
  const currentSite = useSiteStore((state) => state.currentSite);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "quantity" | "available">("available");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (!currentSite) return null;

  const allItems = getInventoryBySite(currentSite.id);
  const lowStockItems = getLowStockItems(currentSite.id);

  let filteredItems = allItems.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterLowStock) {
    filteredItems = filteredItems.filter(
      (item) => item.available <= item.alertThreshold
    );
  }

  filteredItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.productName.localeCompare(b.productName);
        break;
      case "quantity":
        comparison = a.quantity - b.quantity;
        break;
      case "available":
        comparison = a.available - b.available;
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: "name" | "quantity" | "available") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const totalValue = allItems.reduce(
    (sum, item) => sum + item.available * 10,
    0
  );
  const totalItems = allItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const stats = [
    {
      label: "SKU 总数",
      value: allItems.length,
      icon: <Package className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "总库存数量",
      value: totalItems.toLocaleString(),
      icon: <Warehouse className="w-5 h-5" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "库存预警",
      value: lowStockItems.length,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "库存估值",
      value: formatCurrencySymbol(totalValue, currentSite.currencySymbol),
      icon: <TrendingDown className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">库存管理</h1>
          <p className="text-slate-400 mt-1">
            <span className="text-xl mr-2">{currentSite.flag}</span>
            {currentSite.name} 库存概览
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
                <h3 className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-amber-300">
                有 {lowStockItems.length} 个商品库存不足
              </h4>
              <p className="text-sm text-amber-400/70">
                请及时补货，避免影响销售
              </p>
            </div>
            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className="px-4 py-2 bg-amber-500/20 text-amber-300 text-sm font-medium rounded-lg hover:bg-amber-500/30 transition-colors"
            >
              {filterLowStock ? "显示全部" : "查看预警"}
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>库存列表</CardTitle>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="搜索商品名称、SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-all"
                />
              </div>

              <button
                onClick={() => setFilterLowStock(!filterLowStock)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterLowStock
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700/80"
                }`}
              >
                <Filter className="w-4 h-4" />
                仅显示库存不足
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                    >
                      商品信息
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    仓库
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("quantity")}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors ml-auto"
                    >
                      总库存
                      {sortBy === "quantity" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    已预留
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("available")}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors ml-auto"
                    >
                      可用库存
                      {sortBy === "available" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </button>
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    最后更新
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredItems.map((item) => {
                  const isLowStock = item.available <= item.alertThreshold;
                  const stockPercentage =
                    (item.available / item.alertThreshold) * 100;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-2xl">
                            {item.image}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">
                              {item.productName}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              {item.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="default" size="sm">
                          <Warehouse className="w-3 h-3 mr-1" />
                          {item.warehouse}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-slate-200">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-slate-400">
                        {item.reserved.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div
                          className={`font-semibold ${
                            isLowStock ? "text-amber-400" : "text-slate-100"
                          }`}
                        >
                          {item.available.toLocaleString()}
                        </div>
                        <div className="mt-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLowStock
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(stockPercentage, 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isLowStock ? (
                          <Badge variant="warning" size="sm">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            库存不足
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm">
                            库存充足
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-slate-500">
                        {formatRelativeTime(item.lastUpdated)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">暂无库存数据</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;

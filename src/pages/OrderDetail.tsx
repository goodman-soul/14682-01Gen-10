import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  CreditCard,
  Receipt,
  Clock,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSiteStore } from "@/store/useSiteStore";
import { formatCurrencySymbol } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { getOrderById } from "@/data/orders";
import { OrderStatus } from "@/types";

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentSite = useSiteStore((state) => state.currentSite);
  const order = getOrderById(id || "");

  if (!currentSite || !order) {
    return (
      <div className="text-center py-20 text-slate-500">
        <Package className="w-20 h-20 mx-auto mb-4 opacity-20" />
        <p className="text-xl">订单不存在</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 text-blue-400 hover:text-blue-300"
        >
          返回订单列表
        </button>
      </div>
    );
  }

  const getStatusConfig = (status: OrderStatus) => {
    const config: Record<OrderStatus, { label: string; variant: any; step: number }> = {
      pending: { label: "待付款", variant: "warning", step: 1 },
      paid: { label: "已付款", variant: "info", step: 2 },
      shipped: { label: "运输中", variant: "purple", step: 3 },
      delivered: { label: "已送达", variant: "success", step: 4 },
      cancelled: { label: "已取消", variant: "error", step: 0 },
    };
    return config[status];
  };

  const statusConfig = getStatusConfig(order.status);
  const steps = ["已下单", "已付款", "已发货", "已送达"];

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = order.taxInfo?.amount || 0;
  const total = subtotal + shipping + tax;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="p-2 rounded-xl border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">订单详情</h1>
          <p className="text-slate-400 mt-1">
            订单号: <span className="text-slate-200 font-mono">{order.orderNo}</span>
          </p>
        </div>
        <Badge variant={statusConfig.variant} className="ml-auto">
          {statusConfig.label}
        </Badge>
      </div>

      {order.status !== "cancelled" && (
        <Card>
          <CardHeader>
            <CardTitle>订单进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const isCompleted = statusConfig.step > index;
                const isCurrent = statusConfig.step === index + 1;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40"
                            : isCurrent
                            ? "bg-blue-500/20 text-blue-400 border-2 border-blue-500/40 animate-pulse"
                            : "bg-slate-800 text-slate-500 border-2 border-slate-700/50"
                        }`}
                      >
                        {isCompleted ? (
                          <Package className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isCompleted
                            ? "text-emerald-400"
                            : isCurrent
                            ? "text-blue-400"
                            : "text-slate-500"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-4">
                        <div className="h-0.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isCompleted ? "bg-emerald-500" : ""
                            }`}
                            style={{
                              width: isCompleted ? "100%" : "0%",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                商品信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center text-3xl">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-200 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-slate-500 font-mono">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">
                        {formatCurrencySymbol(item.price, currentSite.currencySymbol)} × {item.quantity}
                      </div>
                      <div className="text-lg font-semibold text-slate-100 mt-1">
                        {formatCurrencySymbol(
                          item.price * item.quantity,
                          currentSite.currencySymbol
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {currentSite.logistics.enabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-400" />
                  物流信息
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.logisticsInfo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-800/30">
                        <div className="text-sm text-slate-500 mb-1">
                          物流公司
                        </div>
                        <div className="font-medium text-slate-200">
                          {order.logisticsInfo.provider}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-800/30">
                        <div className="text-sm text-slate-500 mb-1">
                          运单号
                        </div>
                        <div className="font-mono text-slate-200">
                          {order.logisticsInfo.trackingNo}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                      <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          预计送达
                        </span>
                      </div>
                      <div className="text-slate-200">
                        {order.logisticsInfo.estimatedDelivery}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Truck className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>暂无物流信息</p>
                  </div>
                )}

                <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <div className="text-sm text-blue-400 font-medium mb-1">
                    物流提示
                  </div>
                  <p className="text-sm text-slate-300">
                    {currentSite.logistics.tips}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                订单金额
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">商品小计</span>
                <span className="text-slate-200">
                  {formatCurrencySymbol(subtotal, currentSite.currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">运费</span>
                <span className="text-slate-200">
                  {shipping === 0
                    ? "免运费"
                    : formatCurrencySymbol(shipping, currentSite.currencySymbol)}
                </span>
              </div>
              {currentSite.tax.enabled && order.taxInfo && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    {order.taxInfo.description}
                  </span>
                  <span className="text-slate-200">
                    {formatCurrencySymbol(tax, currentSite.currencySymbol)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-700/50 flex justify-between">
                <span className="font-medium text-slate-200">订单总额</span>
                <span className="text-xl font-bold text-emerald-400">
                  {formatCurrencySymbol(total, currentSite.currencySymbol)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                收货地址
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="font-medium text-slate-200">
                  {order.shippingAddress.name}
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>
                    <Phone className="w-4 h-4 inline mr-2" />
                    {order.shippingAddress.phone}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {order.shippingAddress.addressLine1}
                      {order.shippingAddress.addressLine2 && (
                        <>
                          <br />
                          {order.shippingAddress.addressLine2}
                        </>
                      )}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                      <br />
                      {order.shippingAddress.country}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" />
                客户信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-lg font-semibold text-slate-200">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {order.customerEmail}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentSite.tax.enabled && order.taxInfo && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-6">
                <div className="text-sm text-emerald-400 font-medium mb-1">
                  税务说明
                </div>
                <p className="text-sm text-slate-300">
                  {order.taxInfo.description}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  税率: {(order.taxInfo.rate * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回订单列表
        </button>
        <div className="text-sm text-slate-500">
          下单时间: {formatDateTime(order.createdAt, "zh-CN")}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

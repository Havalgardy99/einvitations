import { LayoutGrid, Mail, Plus, ShoppingBag, Users } from "lucide-react";
import type { TemplateOrder } from "../../../shared/invitation";
import type { AdminInvitationListItem } from "../../api/client";

interface Props {
  list: AdminInvitationListItem[];
  orders: TemplateOrder[];
  totalRsvps: number;
  totalWishes: number;
  totalNewOrders: number;
  onOpenAccount: (id: string) => void;
  onGoOrders: () => void;
}

export default function AdminOverviewGrid({
  list,
  orders,
  totalRsvps,
  totalWishes,
  totalNewOrders,
  onOpenAccount,
  onGoOrders
}: Props) {
  const recentOrders = orders.slice(0, 5);
  const recentAccounts = list.slice(0, 4);
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
  const doneOrders = orders.filter((o) => o.status === "done").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min">
      {/* Recent orders */}
      <div className="dash-card p-5 md:col-span-1 xl:col-span-1 xl:row-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1a1d1f]">ئۆردەرە نوێیەکان</h3>
          <button type="button" onClick={onGoOrders} className="text-xs text-[#22c55e] hover:underline">
            هەموو
          </button>
        </div>
        <ul className="space-y-3">
          {recentOrders.length === 0 ? (
            <li className="text-sm text-[#9ca3af] py-6 text-center">هێشتا ئۆردەر نییە</li>
          ) : (
            recentOrders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-[#f3f4f6] last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1a1d1f] truncate">{order.customerName}</p>
                  <p className="text-xs text-[#9ca3af]">{order.templateName}</p>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full shrink-0 ${
                    order.status === "new"
                      ? "bg-[#fef3c7] text-[#d97706]"
                      : order.status === "confirmed"
                        ? "bg-[#dbeafe] text-[#2563eb]"
                        : "bg-[#f0fdf4] text-[#22c55e]"
                  }`}
                >
                  {order.status === "new" ? "نوێ" : order.status === "confirmed" ? "پەسەند" : "تەواو"}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Stats + chart */}
      <div className="dash-card p-5">
        <h3 className="font-semibold text-[#1a1d1f] mb-4">ڕاپۆرت</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-[#9ca3af]">ئەکاونت</p>
            <p className="text-2xl font-bold text-[#1a1d1f]">{list.length}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af]">RSVP</p>
            <p className="text-2xl font-bold text-[#22c55e]">{totalRsvps}</p>
          </div>
        </div>
        <div className="dash-mini-chart" />
      </div>

      {/* Calendar / date */}
      <div className="dash-card p-5">
        <h3 className="font-semibold text-[#1a1d1f] mb-3">ئەمڕۆ</h3>
        <p className="text-3xl font-bold text-[#1a1d1f]">{new Date().getDate()}</p>
        <p className="text-sm text-[#6b7280] mt-1">
          {new Date().toLocaleDateString("ku", { month: "long", year: "numeric" })}
        </p>
        <div className="mt-4 flex gap-1.5 flex-wrap">
          {list.slice(0, 5).map((inv) => (
            <span
              key={inv.id}
              className="w-2 h-2 rounded-full bg-[#22c55e]"
              title={inv.accountName}
            />
          ))}
        </div>
      </div>

      {/* Highlight new orders */}
      <div className="dash-highlight p-5 flex flex-col justify-between min-h-[140px]">
        <div>
          <p className="text-white/80 text-sm">ئۆردەری چاوەڕوان</p>
          <p className="text-4xl font-bold mt-1">{totalNewOrders}</p>
        </div>
        <button
          type="button"
          onClick={onGoOrders}
          className="self-start text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
        >
          بینینی ئۆردەرەکان
        </button>
      </div>

      {/* Quick stats row */}
      <div className="dash-card p-5 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="dash-stat-icon">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[#9ca3af]">RSVP</p>
            <p className="text-lg font-bold">{totalRsvps}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="dash-stat-icon">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[#9ca3af]">پیرۆزبایی</p>
            <p className="text-lg font-bold">{totalWishes}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="dash-stat-icon">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[#9ca3af]">ئەکاونت</p>
            <p className="text-lg font-bold">{list.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="dash-stat-icon">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[#9ca3af]">ئۆردەر</p>
            <p className="text-lg font-bold">{orders.length}</p>
          </div>
        </div>
      </div>

      {/* Order status breakdown */}
      <div className="dash-card p-5 md:col-span-2 xl:col-span-1">
        <h3 className="font-semibold text-[#1a1d1f] mb-4">دۆخی ئۆردەر</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">نوێ</span>
            <span className="font-medium text-[#d97706]">{totalNewOrders}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">پەسەندکراو</span>
            <span className="font-medium text-[#2563eb]">{confirmedOrders}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">تەواوبوو</span>
            <span className="font-medium text-[#22c55e]">{doneOrders}</span>
          </div>
        </div>
      </div>

      {/* Recent accounts */}
      <div className="dash-card p-5 md:col-span-2 xl:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1a1d1f]">ئەکاونتە نوێیەکان</h3>
          <Plus className="w-4 h-4 text-[#22c55e]" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {recentAccounts.length === 0 ? (
            <p className="text-sm text-[#9ca3af] col-span-2 py-4 text-center">هێشتا ئەکاونت نییە</p>
          ) : (
            recentAccounts.map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => onOpenAccount(inv.id)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#f3f4f6] hover:border-[#22c55e]/30 hover:bg-[#f0fdf4]/50 transition text-right"
              >
                <img
                  src={inv.coverImageUrl}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {inv.coupleName1} & {inv.coupleName2}
                  </p>
                  <p className="text-xs text-[#9ca3af]">{inv.rsvpCount} RSVP</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

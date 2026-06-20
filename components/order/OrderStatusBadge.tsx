import { OrderStatus } from "@/types";
import { STATUS_COLORS, STATUS_LABELS, cn } from "@/lib/utils";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("badge", STATUS_COLORS[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CabinetTransaction } from "@/lib/types/cabinet-detail";

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function CabinetTransactionsList({
  transactions,
}: {
  transactions: CabinetTransaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-sm text-neutral-500">
        No swap transactions recorded yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Slot</TableHead>
          <TableHead>Battery Out</TableHead>
          <TableHead>Battery In</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="text-neutral-800">
              {formatDateTime(tx.swapped_at)}
            </TableCell>
            <TableCell>
              {tx.slot_number != null ? `Slot ${tx.slot_number}` : "—"}
            </TableCell>
            <TableCell className="tabular-nums">
              {tx.battery_out_soc != null ? `${tx.battery_out_soc}%` : "—"}
            </TableCell>
            <TableCell className="tabular-nums">
              {tx.battery_in_soc != null ? `${tx.battery_in_soc}%` : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

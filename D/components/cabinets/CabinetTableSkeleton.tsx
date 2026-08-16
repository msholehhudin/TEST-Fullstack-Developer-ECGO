import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = [
  "Code",
  "Branch",
  "Status",
  "Slots",
  "Swaps (24h)",
  "Last Heartbeat",
];

export function CabinetTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {COLUMNS.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {COLUMNS.map((col) => (
              <TableCell key={col}>
                <Skeleton className="h-4 w-full max-w-24" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

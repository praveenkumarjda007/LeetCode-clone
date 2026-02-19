import { useSubmissions } from "@/hooks/use-submissions";
import { format } from "date-fns";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SubmissionHistory() {
  const { data: submissions, isLoading } = useSubmissions();

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!submissions?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {sub.status === "Accepted" ? (
                    <CheckCircle2 className="w-4 h-4 text-easy" />
                  ) : sub.status === "Pending" ? (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <XCircle className="w-4 h-4 text-hard" />
                  )}
                  <span className={
                    sub.status === "Accepted" ? "text-easy font-medium" : 
                    sub.status === "Pending" ? "text-muted-foreground" : "text-hard font-medium"
                  }>
                    {sub.status}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{sub.problem?.title || `Problem #${sub.problemId}`}</TableCell>
              <TableCell className="capitalize">{sub.language}</TableCell>
              <TableCell>{sub.executionTime ? `${sub.executionTime}ms` : "-"}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {sub.createdAt ? format(new Date(sub.createdAt), "MMM d, HH:mm") : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotesCardProps {
  notes?: string;
}

export const NotesCard = ({ notes }: NotesCardProps) => {
  if (!notes) return null;

  return (
    <Card className="border-none shadow-sm rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
          <FileText className="w-4 h-4 text-slate-400" />
          Additional Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-slate-700">{notes}</p>
      </CardContent>
    </Card>
  );
};

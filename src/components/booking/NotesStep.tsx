// components/booking/NotesStep.tsx
import { Card, CardContent } from "@/components/ui/card";

interface NotesStepProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const NotesStep = ({ notes, setNotes }: NotesStepProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Additional Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests or notes..."
          className="w-full p-3 border rounded-lg min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

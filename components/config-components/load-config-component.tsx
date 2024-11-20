import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LoadConfigProps {
  handleLoadConfig: React.ChangeEventHandler<HTMLInputElement>;
  errorLoad: string;
}

export function LoadConfigComponent({ handleLoadConfig, errorLoad }: LoadConfigProps) {
  return (
    <div className="grid w-full gap-1.5 mb-8">
      <Label className="font-semibold text-lg">Load config</Label>
      <Input type="file" accept=".json" onChange={handleLoadConfig} />
      <p className="text-red-600">{errorLoad}</p>
    </div>
  );
}

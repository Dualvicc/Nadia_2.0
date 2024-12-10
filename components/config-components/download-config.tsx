import { Button } from "@/components/ui/button";
import { downloadJSON } from "@/lib/client/utils";

export function DownloadConfig({
  generatedJson,
  configName,
  clickFunction
}: {
  generatedJson: string | undefined;
  configName: string;
  clickFunction?: React.MouseEventHandler<HTMLButtonElement>;
}) {

  return (
    <Button className="mr-2"
      onClick={() =>
        {
            downloadJSON(generatedJson ? generatedJson : "", `${configName || "config"}.json`);
            clickFunction;
        }
      }
      disabled={!generatedJson}
    >
      Save config data
    </Button>
  );
}

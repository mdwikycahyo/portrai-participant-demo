"use client";

import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";

// Dynamically import PDF components to avoid SSR issues
const PDFViewer = dynamic(() => import("../pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] flex items-center justify-center">
      Loading PDF viewer...
    </div>
  ),
});

interface SimulationTabProps {
  hasReadSimulation: boolean;
  onReadSimulationChange: (checked: boolean) => void;
}

export function SimulationTab({
  hasReadSimulation,
  onReadSimulationChange,
}: SimulationTabProps) {
  return (
    <div className="flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2 py-2">
        <h1 className="text-xl font-bold text-gray-800">Simulation</h1>
        <div className="max-w-md">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="reading-agreement"
              checked={hasReadSimulation}
              onCheckedChange={(checked) =>
                onReadSimulationChange(checked === true)
              }
              className="h-5 w-5"
            />
            <label
              htmlFor="reading-agreement"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              I have read and understood the simulation material
            </label>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <PDFViewer />
      </div>
    </div>
  );
}
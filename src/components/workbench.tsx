'use client';

import type { FlowType } from '@/app/page';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoaderCircle, Sparkles, Smile, Users, Telescope, Wand2, Film, PencilRuler } from 'lucide-react';


interface WorkbenchProps {
  onReimagine: (type: FlowType) => void;
  loadingFlow: string | null;
}

const actionButtons = [
  { type: 'moment' as FlowType, label: 'Another Moment', icon: Sparkles, tooltip: 'Generate a candid moment just before or after this shot.' },
  { type: 'smile' as FlowType, label: 'Subtle Smile', icon: Smile, tooltip: 'Add a natural-looking smile to the main subject.' },
  { type: 'pose' as FlowType, label: 'Slight Pose', icon: Users, tooltip: 'Change the subjects\' poses in a subtle, natural way.' },
  { type: 'widen' as FlowType, label: 'Expand Scene', icon: Telescope, tooltip: 'Widen the photo to see more of the surroundings.' },
];

const futureActionButtons = [
    { type: 'scenery' as FlowType, label: 'Change Scenery', icon: Wand2, tooltip: 'Place the subjects in a completely new environment.' },
    { type: 'animate' as FlowType, label: 'Animate Memory', icon: Film, tooltip: 'Create a short, living video from your photo.' },
]

export function Workbench({ onReimagine, loadingFlow }: WorkbenchProps) {
  return (
    <div className="p-4 flex flex-col h-full">
        <div className="p-2">
            <h2 className="text-lg font-headline font-semibold tracking-wide">The Workbench</h2>
            <p className="text-sm text-muted-foreground">Select a tool to re-imagine your active photo.</p>
        </div>
        <Separator className="my-2" />
        <TooltipProvider>
            <div className="flex flex-col gap-3 py-2">
            {actionButtons.map(({ type, label, icon: Icon, tooltip }) => (
                <Tooltip key={type} delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button
                    onClick={() => onReimagine(type)}
                    disabled={loadingFlow !== null}
                    variant="ghost"
                    className="h-12 text-sm justify-start gap-3 px-4 hover:bg-accent hover:text-accent-foreground transition-all duration-200 group/button"
                    >
                    {loadingFlow === type ? (
                        <LoaderCircle className="animate-spin h-5 w-5" />
                    ) : (
                        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover/button:text-accent-foreground" />
                    )}
                    <span className="truncate">{label}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                    <p>{tooltip}</p>
                </TooltipContent>
                </Tooltip>
            ))}
            </div>
            <Separator className="my-2" />
             <div className="p-2 mt-2">
                <h3 className="text-sm font-headline font-semibold tracking-wide text-muted-foreground/80 flex items-center gap-2">
                    <PencilRuler className="h-4 w-4"/>
                    Coming Soon
                </h3>
            </div>
             <div className="flex flex-col gap-3 py-2">
            {futureActionButtons.map(({ type, label, icon: Icon, tooltip }) => (
                <Tooltip key={type} delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button
                    onClick={() => onReimagine(type)}
                    disabled={loadingFlow !== null}
                    variant="ghost"
                    className="h-12 text-sm justify-start gap-3 px-4 transition-all duration-200 group/button opacity-50 cursor-not-allowed"
                    >
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span className="truncate">{label}</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                    <p>{tooltip} (Coming Soon)</p>
                </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </TooltipProvider>
    </div>
  );
}

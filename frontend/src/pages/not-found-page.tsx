import { Link } from "react-router-dom";
import { Compass, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="panel w-full max-w-md rounded-[2.25rem] border border-ink-100/90 bg-white/95 p-8 sm:p-10 text-center shadow-card animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rail-50 text-rail-700 border border-rail-200/70 shadow-2xs">
          <Compass className="h-8 w-8 text-rail-600 animate-spin-slow" />
        </div>
        <span className="mt-6 inline-block rounded-full bg-ink-100 px-3 py-1 font-mono text-xs font-bold text-ink-700">
          Error 404
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          Station not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          The requested track or page does not exist. Return to the main station to find active train
          runs.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button className="shadow-xs">
              <TrainFront className="mr-2 h-4 w-4" />
              Return to search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


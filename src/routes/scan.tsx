import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ImageUp, Loader2 } from "lucide-react";
import { analyzePlant } from "@/lib/plant.functions";
import { saveScan } from "@/lib/plant-types";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan your plant — PlantAI camera" },
      {
        name: "description",
        content: "Point your camera at a crop and capture a photo for instant AI plant analysis.",
      },
      { property: "og:title", content: "Scan your plant with PlantAI" },
      { property: "og:description", content: "Place the plant inside the frame and capture." },
    ],
  }),
  component: Scanner,
});

const MAX = 1024;

function downscale(source: HTMLVideoElement | HTMLImageElement, w: number, h: number) {
  const scale = Math.min(1, MAX / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

function Scanner() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analyze = useServerFn(analyzePlant);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch {
        if (!cancelled) setCameraError("Camera unavailable. You can upload a photo instead.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const runAnalysis = useCallback(
    async (image: string) => {
      setAnalyzing(true);
      setError(null);
      try {
        const analysis = await analyze({ data: { image } });
        saveScan({ image, analysis, messages: [], createdAt: Date.now() });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        navigate({ to: "/result" });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
        setAnalyzing(false);
      }
    },
    [analyze, navigate],
  );

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    void runAnalysis(downscale(video, video.videoWidth, video.videoHeight));
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => void runAnalysis(downscale(img, img.width, img.height));
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (analyzing) return <AnalyzingScreen />;

  return (
    <main className="relative min-h-[100dvh] bg-primary-deep">
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col">
        <div className="flex items-center gap-3 px-5 pt-12 text-primary-foreground">
          <button
            onClick={() => navigate({ to: "/home" })}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Scan your plant</h1>
        </div>

        <div className="relative mt-6 flex-1 overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-[2.5rem] border-4 border-primary-foreground/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
          {cameraError && (
            <div className="absolute inset-x-6 top-6 rounded-2xl bg-background/95 p-4 text-sm text-foreground">
              {cameraError}
            </div>
          )}
        </div>

        <div className="space-y-4 px-6 pb-10 pt-6 text-center">
          {error && <p className="text-sm text-destructive-foreground">{error}</p>}
          <p className="text-sm text-primary-foreground/85">Place the plant inside the frame.</p>
          <button
            onClick={capture}
            disabled={!!cameraError}
            aria-label="Capture photo"
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary-foreground/70 disabled:opacity-40"
          >
            <span className="h-16 w-16 rounded-full bg-primary" />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="mx-auto flex h-12 items-center justify-center gap-2 rounded-full bg-primary-foreground/15 px-6 text-sm font-medium text-primary-foreground"
          >
            <ImageUp className="h-4 w-4" /> Upload photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
          />
        </div>
      </div>
    </main>
  );
}

function AnalyzingScreen() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col items-center justify-center px-8 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h1 className="mt-6 text-2xl font-bold">Analyzing your plant...</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        PlantAI is identifying the plant and checking for visible health problems.
      </p>
    </main>
  );
}

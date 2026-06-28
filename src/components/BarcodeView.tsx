import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

interface Props {
  value: string;
  format: string;
  className?: string;
  height?: number;
}

export function BarcodeView({ value, format, className, height = 110 }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!value) return;
    const fmt = (format || "CODE128").toUpperCase();
    if (fmt === "QR" || fmt === "DATAMATRIX") {
      if (ref.current) {
        QRCode.toCanvas(ref.current, value, { width: 320, margin: 1, color: { dark: "#0a0a0a", light: "#ffffff" } }).catch(() => {});
      }
    } else if (svgRef.current) {
      try {
        const map: Record<string, string> = { EAN13: "EAN13", UPC: "UPC", CODE128: "CODE128", PDF417: "CODE128" };
        JsBarcode(svgRef.current, value, {
          format: map[fmt] ?? "CODE128",
          height,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#0a0a0a",
        });
      } catch {}
    }
  }, [value, format, height]);

  const isMatrix = ["QR", "DATAMATRIX"].includes((format || "").toUpperCase());

  return (
    <div className={`grid place-items-center rounded-2xl bg-white p-4 ${className ?? ""}`}>
      {isMatrix ? (
        <canvas ref={ref} className="h-auto w-full max-w-[280px]" />
      ) : (
        <svg ref={svgRef} className="h-auto w-full" />
      )}
    </div>
  );
}

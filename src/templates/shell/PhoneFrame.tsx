import React, { useEffect, useState } from "react";
import { PhoneFrameContext, type PhoneFrameSize } from "./PhoneFrameContext";

interface PhoneFrameProps {
  children: React.ReactNode;
  outerClass?: string;
  screenClass?: string;
  showDeviceChrome?: boolean;
}

function measureFrameSize(): PhoneFrameSize {
  const vv = window.visualViewport;
  const viewportW = vv?.width ?? window.innerWidth;
  const viewportH = vv?.height ?? window.innerHeight;
  const isMobile = viewportW < 640;

  if (isMobile) {
    return {
      width: Math.round(viewportW),
      height: Math.round(viewportH),
      isMobile: true
    };
  }

  const maxH = Math.min(viewportH - 32, 900);
  const maxW = Math.min(viewportW - 32, 430);
  const targetH = 840;
  const targetW = 396;
  const scale = Math.min(maxH / targetH, maxW / targetW, 1.15);

  return {
    width: Math.round(targetW * scale),
    height: Math.round(targetH * scale),
    isMobile: false
  };
}

export default function PhoneFrame({
  children,
  outerClass = "bg-[#11100F]",
  screenClass = "bg-[#D4C6C4]",
  showDeviceChrome = true
}: PhoneFrameProps) {
  const [frameSize, setFrameSize] = useState<PhoneFrameSize>(() => measureFrameSize());

  useEffect(() => {
    const update = () => setFrameSize(measureFrameSize());
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  const { width, height, isMobile } = frameSize;

  return (
    <PhoneFrameContext.Provider value={frameSize}>
      <div
        className={`min-h-dvh w-full ${outerClass} text-[#F3EFE9] flex items-center justify-center font-sans overflow-hidden antialiased relative`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)"
        }}
      >
        <div className="relative z-10 w-full h-full flex items-center justify-center p-0 sm:p-4 min-h-0">
          {showDeviceChrome && !isMobile && (
            <div className="hidden sm:block relative mx-auto select-none pointer-events-none z-30">
              <div className="absolute -inset-[14px] rounded-[52px] bg-linear-to-b from-[#3E3C3A] via-[#242321] to-[#151413] border border-[#524E4A]/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]" />
              <div className="absolute -inset-[11px] rounded-[49px] border-[3px] border-[#2C2A28] opacity-90" />
              <div className="absolute -inset-[1px] rounded-[40px] border-[10px] border-black" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50" />
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/60 rounded-full z-50" />
            </div>
          )}
          <div
            style={{
              width,
              height: isMobile ? height : height,
              maxHeight: isMobile ? "100dvh" : "calc(100dvh - 2rem)"
            }}
            className={`relative overflow-hidden flex flex-col z-20 min-h-0 ${
              isMobile
                ? "w-full h-full sm:rounded-none"
                : "sm:rounded-[38px] shadow-2xl sm:border sm:border-black/40"
            } ${screenClass}`}
          >
            {children}
          </div>
        </div>
      </div>
    </PhoneFrameContext.Provider>
  );
}

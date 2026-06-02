import { createContext, useContext } from "react";

export interface PhoneFrameSize {
  width: number;
  height: number;
  isMobile: boolean;
}

const defaultSize: PhoneFrameSize = { width: 390, height: 780, isMobile: true };

export const PhoneFrameContext = createContext<PhoneFrameSize>(defaultSize);

export function usePhoneFrameSize() {
  return useContext(PhoneFrameContext);
}

import type { InvitationTemplate } from "../types";

export interface TemplateExperienceProps {
  config: InvitationTemplate;
  slug: string;
}

export type TabId = "invite" | "timeline" | "rsvp" | "wishes";

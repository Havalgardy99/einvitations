import type { TemplateExperienceProps } from "../types";
import LuxuryThemedFlow from "../shared/LuxuryThemedFlow";

export default function ClassicExperience(props: TemplateExperienceProps) {
  return <LuxuryThemedFlow {...props} themeId="classic" />;
}

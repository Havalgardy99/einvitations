import type { InvitationTemplate } from "./types";
import { TemplateExperience } from "./templates/registry";

interface AppProps {
  config: InvitationTemplate;
  slug: string;
}

export default function App({ config, slug }: AppProps) {
  return <TemplateExperience config={config} slug={slug} />;
}

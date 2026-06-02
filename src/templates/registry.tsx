import type { ComponentType } from "react";
import type { TemplateExperienceProps } from "./types";
import type { TemplatePresetKey } from "../../shared/templates";
import RoyalExperience from "./royal/RoyalExperience";
import GardenExperience from "./garden/GardenExperience";
import NightExperience from "./night/NightExperience";
import MinimalExperience from "./minimal/MinimalExperience";
import SunsetExperience from "./sunset/SunsetExperience";
import ClassicExperience from "./classic/ClassicExperience";
import CinematicExperience from "./cinematic/CinematicExperience";

const TEMPLATE_MAP: Record<TemplatePresetKey, ComponentType<TemplateExperienceProps>> = {
  royal: RoyalExperience,
  garden: GardenExperience,
  night: NightExperience,
  minimal: MinimalExperience,
  sunset: SunsetExperience,
  classic: ClassicExperience,
  cinematic: CinematicExperience
};

function resolveTemplateKey(config: TemplateExperienceProps["config"]): TemplatePresetKey {
  if (config.templateKey && config.templateKey in TEMPLATE_MAP) {
    return config.templateKey as TemplatePresetKey;
  }
  const fromSlug = config.slug.match(/^demo-([a-z]+)$/);
  if (fromSlug && fromSlug[1] in TEMPLATE_MAP) {
    return fromSlug[1] as TemplatePresetKey;
  }
  return "royal";
}

export function TemplateExperience({ config, slug }: TemplateExperienceProps) {
  const key = resolveTemplateKey(config);
  const Component = TEMPLATE_MAP[key] ?? RoyalExperience;
  return <Component config={{ ...config, templateKey: key }} slug={slug} />;
}

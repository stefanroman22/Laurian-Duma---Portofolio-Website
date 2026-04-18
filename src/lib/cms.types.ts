// Auto-generated types for project: laurian-duma-portfolio
// Do not edit — regenerate with: npm run cms:sync-types

export interface CMSContent {
  project_slug: "laurian-duma-portfolio";
  project_name: string;
  last_updated: string | null;
  content: {
    cv: { _type: "key_value"; _label: string; entries?: Record<string, unknown> };
    hero_image: { _type: "image"; _label: string; url?: string; alt?: string };
    skills: { _type: "key_value"; _label: string; entries?: Record<string, unknown> };
    experience: { _type: "repeater"; _label: string; _schema?: Array<{ key: string; label: string; type: string }>; items?: Record<string, unknown>[] };
    projects_list: { _type: "repeater"; _label: string; _schema?: Array<{ key: string; label: string; type: string }>; items?: Record<string, unknown>[] };
    hobbies: { _type: "repeater"; _label: string; _schema?: Array<{ key: string; label: string; type: string }>; items?: Record<string, unknown>[] };
  };
}

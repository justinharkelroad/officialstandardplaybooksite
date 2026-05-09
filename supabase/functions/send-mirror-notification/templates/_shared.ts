export type MirrorTier =
  | "foundation"
  | "developing"
  | "established"
  | "advanced"
  | "elite";

export type MirrorPillar =
  | "culture_team"
  | "systems_rhythm"
  | "training_scripts"
  | "marketing_lead_flow"
  | "owner_command";

export interface MirrorEmailContext {
  firstName: string;
  fullName: string;
  score: number;
  tierName: string;
  tier: MirrorTier;
  weakestPillar: MirrorPillar;
  weakestPillarName: string;
  diagnosticParagraph: string;
  pdfDownloadUrl: string;
}

export interface MirrorEmail {
  subject: string;
  preheader: string;
  /** Body in lightweight markdown (paragraphs separated by blank lines, **bold**, [text](url) links). */
  body: string;
}

export interface MirrorTierSequenceEntry {
  /** Day offset from submission. 0 = send immediately. */
  daysOffset: number;
  build: (ctx: MirrorEmailContext) => MirrorEmail;
}

/**
 * "Mein Weg / My Journey" — taken from Luana's LinkedIn profile (state: October 2026).
 * Visitor-facing text (titles, descriptions, skills) lives in the translation files
 * under "journey.items.<id>" and "journey.steps.<id>".
 *
 * Chapters appear in this order — what Luana does today comes first.
 * Dates use 'YYYY-MM' and are formatted per language. A missing `to` means "today".
 * Organisation and team names are proper names and are not translated.
 */
export interface JourneyStep {
  id: string
  /** Team or company name */
  name: string
  from: string
  to?: string
}

export interface JourneyEntry {
  id: string
  institution: string
  from: string
  to?: string
  /** For certificates: show "issued <date>" instead of a period */
  certificate?: boolean
  employment?: 'full' | 'part'
  /** Stations within an apprenticeship */
  steps?: JourneyStep[]
  /** Optional logo in /public/media/logos */
  logo?: string
}

export interface JourneyChapter {
  id: 'apprenticeship' | 'school' | 'current'
  entries: JourneyEntry[]
}

export const journey: JourneyChapter[] = [
  {
    id: 'current',
    entries: [
      { id: 'voicesteps', institution: 'VoiceSteps', from: '2026-07', employment: 'part' },
      { id: 'sunrise-training', institution: 'Sunrise GmbH', from: '2026-08', employment: 'full' },
    ],
  },
  {
    id: 'apprenticeship',
    entries: [
      {
        id: 'sunrise-apprenticeship',
        institution: 'Sunrise GmbH',
        from: '2022-08',
        to: '2026-08',
        steps: [
          { id: 'ictbbc', name: 'ICT Berufsbildungscenter AG', from: '2022-08', to: '2023-07' },
          { id: 'avengers', name: 'Digital Avengers Lab', from: '2023-08', to: '2024-07' },
          { id: 'flanker', name: 'Flanker Brands – yallo, Lebara, swype', from: '2024-08', to: '2025-07' },
          { id: 'hr', name: 'HR Young Talents | People and Development', from: '2025-08', to: '2026-07' },
        ],
      },
    ],
  },
  {
    id: 'school',
    entries: [
      { id: 'bzz-efz', institution: 'Bildungszentrum Zürichsee BZZ', from: '2022-08', to: '2026-07' },
      { id: 'bzz-bm', institution: 'Bildungszentrum Zürichsee BZZ', from: '2022-08', to: '2026-07' },
      { id: 'cambridge', institution: 'Cambridge English', from: '2025-12', certificate: true },
    ],
  },
]

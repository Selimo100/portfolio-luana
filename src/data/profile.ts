/**
 * Luana's personal data — the single place for contact details and links.
 *
 * ⚠️ Everything here must be reviewed by Luana before publication.
 * Visitor-facing biography text lives in the translation files
 * (src/i18n/locales/de.json + en.json → "about").
 *
 * Empty strings hide the related UI: no email = no email button,
 * no cvUrl = no CV download link, no portrait = editorial placeholder.
 */
export const profile = {
  name: 'Luana Costa',
  firstName: 'Luana',
  lastName: 'Costa',
  /** Contact email — intentionally empty until Luana provides one. */
  email: '',
  linkedin: 'https://www.linkedin.com/in/luana-costa-187920289/',
  /** e.g. '/media/luana-costa-cv.pdf' — put the PDF into /public/media. */
  cvUrl: '',
  /** e.g. '/media/portrait.jpg'. Empty = designed placeholder. */
  portrait: '',
  /** Year of the EFZ diploma + Berufsmaturität (publicly indexed — please verify). */
  graduationYear: 2026,
} as const

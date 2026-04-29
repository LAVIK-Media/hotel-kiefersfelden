/**
 * Zentraler Schema-Index. Alle Document- und Object-Typen werden hier
 * zusammengeführt und in `sanity.config.ts` als `schema.types` registriert.
 *
 * Reihenfolge: erst Object-Typen (Bausteine), dann Document-Typen.
 */

// ── Objekte (Bausteine) ────────────────────────────────────────────────
import { seo } from './objects/seo'
import { localizedSlug } from './objects/localizedSlug'
import { richImage } from './objects/richImage'
import { seasonalPrice } from './objects/seasonalPrice'
import { openingHours } from './objects/openingHours'
import { contactInfo } from './objects/contactInfo'
import { socialLink } from './objects/socialLink'
import { holidayCheckScore } from './objects/holidayCheckScore'
import { menuSection } from './objects/menuSection'
import { inlineMenuItem } from './objects/inlineMenuItem'
import { navItem } from './objects/navItem'
import { portableText, localizedPortableText } from './objects/portableText'

// ── Dokumente ──────────────────────────────────────────────────────────
import { siteSettings } from './documents/siteSettings'
import { page } from './documents/page'
import { room } from './documents/room'
import { amenity } from './documents/amenity'
import { menu } from './documents/menu'
import { menuItem } from './documents/menuItem'
import { offer } from './documents/offer'
import { activity } from './documents/activity'
import { testimonial } from './documents/testimonial'
import { faq } from './documents/faq'
import { navigation } from './documents/navigation'

export const schemaTypes = [
  // Objekte
  seo,
  localizedSlug,
  richImage,
  seasonalPrice,
  openingHours,
  contactInfo,
  socialLink,
  holidayCheckScore,
  menuSection,
  inlineMenuItem,
  navItem,
  portableText,
  localizedPortableText,

  // Dokumente
  siteSettings,
  page,
  room,
  amenity,
  menu,
  menuItem,
  offer,
  activity,
  testimonial,
  faq,
  navigation,
]

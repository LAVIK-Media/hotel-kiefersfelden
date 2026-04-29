/**
 * LMIV-konforme Allergen- und Zusatzstoff-Listen für Speisekarten-Items.
 * Quelle: Lebensmittelinformations-Verordnung (EU) Nr. 1169/2011, Anhang II
 * + deutsche Lebensmittel-Kennzeichnungs-Verordnung für Zusatzstoffe.
 *
 * Die Codes (1–14, a–n) sind in DE-Gastronomie etabliert; Gäste mit Allergien
 * suchen genau diese Kürzel. Die Beschriftung ist auf DE+EN ausgelegt.
 */

export type AllergenOption = {
  /** Kürzel auf der Speisekarte (z.B. "1") */
  value: string
  titleDe: string
  titleEn: string
}

/** Hauptallergene (LMIV Anhang II). */
export const ALLERGENS: AllergenOption[] = [
  { value: '1', titleDe: 'Glutenhaltiges Getreide', titleEn: 'Cereals containing gluten' },
  { value: '2', titleDe: 'Krebstiere', titleEn: 'Crustaceans' },
  { value: '3', titleDe: 'Eier', titleEn: 'Eggs' },
  { value: '4', titleDe: 'Fisch', titleEn: 'Fish' },
  { value: '5', titleDe: 'Erdnüsse', titleEn: 'Peanuts' },
  { value: '6', titleDe: 'Sojabohnen', titleEn: 'Soybeans' },
  { value: '7', titleDe: 'Milch / Laktose', titleEn: 'Milk / Lactose' },
  { value: '8', titleDe: 'Schalenfrüchte (Nüsse)', titleEn: 'Tree nuts' },
  { value: '9', titleDe: 'Sellerie', titleEn: 'Celery' },
  { value: '10', titleDe: 'Senf', titleEn: 'Mustard' },
  { value: '11', titleDe: 'Sesamsamen', titleEn: 'Sesame seeds' },
  { value: '12', titleDe: 'Schwefeldioxid und Sulfite', titleEn: 'Sulphur dioxide and sulphites' },
  { value: '13', titleDe: 'Lupinen', titleEn: 'Lupin' },
  { value: '14', titleDe: 'Weichtiere', titleEn: 'Molluscs' },
]

/** Zusatzstoffe (deutsche Kennzeichnungspflicht). */
export const ADDITIVES: AllergenOption[] = [
  { value: 'a', titleDe: 'mit Farbstoff', titleEn: 'with colourant' },
  { value: 'b', titleDe: 'mit Konservierungsstoff', titleEn: 'with preservative' },
  { value: 'c', titleDe: 'mit Antioxidationsmittel', titleEn: 'with antioxidant' },
  { value: 'd', titleDe: 'mit Geschmacksverstärker', titleEn: 'with flavour enhancer' },
  { value: 'e', titleDe: 'geschwefelt', titleEn: 'sulphurised' },
  { value: 'f', titleDe: 'geschwärzt', titleEn: 'blackened' },
  { value: 'g', titleDe: 'gewachst', titleEn: 'waxed' },
  { value: 'h', titleDe: 'mit Phosphat', titleEn: 'with phosphate' },
  { value: 'i', titleDe: 'mit Süßungsmittel', titleEn: 'with sweetener' },
  { value: 'j', titleDe: 'enthält Phenylalanin', titleEn: 'contains phenylalanine' },
  { value: 'k', titleDe: 'koffeinhaltig', titleEn: 'contains caffeine' },
  { value: 'l', titleDe: 'chininhaltig', titleEn: 'contains quinine' },
  { value: 'm', titleDe: 'taurinhaltig', titleEn: 'contains taurine' },
  { value: 'n', titleDe: 'mit Süßungsmittel und Zucker', titleEn: 'with sweeteners and sugar' },
]

export const ALLERGEN_OPTIONS = ALLERGENS.map((a) => ({
  title: `${a.value} — ${a.titleDe}`,
  value: a.value,
}))

export const ADDITIVE_OPTIONS = ADDITIVES.map((a) => ({
  title: `${a.value} — ${a.titleDe}`,
  value: a.value,
}))

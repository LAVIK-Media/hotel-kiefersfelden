/**
 * GROQ-Queries für das Frontend (Next.js).
 * Hier zentral gepflegt, damit Studio + Frontend dieselbe Quelle nutzen.
 */

const localizedString = (lang: 'de' | 'en') => `coalesce(
  *[_type == "translation.string" && _key == "${lang}"][0].value,
  ""
)`

/** Aktive Speisekarte: höchstes `date` ≤ heute, sonst aktive Wochenkarte. */
export const ACTIVE_MENU_QUERY = `
*[_type == "menu" && isPublished == true && (
  // Tageskarte heute oder davor
  (defined(date) && date <= $today) ||
  // Wochenkarte mit gültigem Zeitraum
  (defined(validFrom) && validFrom <= $today && (validUntil == null || validUntil >= $today)) ||
  // Standard-/Saisonkarte
  type in ["standardkarte", "saisonkarte"]
)] | order(
  // Tageskarten zuerst (date desc), dann Wochenkarten, dann Standardkarten
  coalesce(date, validFrom, "1970-01-01") desc
)[0] {
  _id,
  type,
  title,
  date,
  validFrom,
  validUntil,
  "sections": sections[] {
    _key,
    name,
    "items": items[] {
      _key,
      _type == "reference" => @-> {
        _id, name, description, price, allergens, additives, isVegetarian, isVegan, isHouseRecommendation, "image": image.asset->url
      },
      _type == "inlineMenuItem" => {
        name, description, price, allergens, additives, isVegetarian, isVegan, isHouseRecommendation, "image": image.asset->url
      }
    }
  }
}
`

/** Alle veröffentlichten Karten (für Archiv / Tageskarten-Liste). */
export const ALL_MENUS_QUERY = `
*[_type == "menu" && isPublished == true] | order(coalesce(date, validFrom) desc) {
  _id, type, title, date, validFrom, validUntil
}
`

/** Site-Settings (Singleton). */
export const SITE_SETTINGS_QUERY = `
*[_type == "siteSettings" && _id == "siteSettings"][0] {
  ...,
  logo {asset->{url, metadata}},
  socialLinks,
  contactInfo,
  openingHours,
  defaultSeo,
  holidayCheck
}
`

/** Navigation (Header oder Footer). */
export const NAVIGATION_QUERY = `
*[_type == "navigation" && _id == $id][0] {
  title,
  items[] {
    _key,
    label,
    "href": coalesce(externalUrl, internalLink->slug.current),
    children[] {
      _key,
      label,
      "href": coalesce(externalUrl, internalLink->slug.current)
    }
  }
}
`

/** Zimmer-Übersicht. */
export const ROOMS_QUERY = `
*[_type == "room"] | order(orderRank asc) {
  _id, name, slug, sizeQm, maxGuests,
  "heroImage": gallery[0]{asset->{url}, alt},
  "minPrice": *[_type == "room" && _id == ^._id][0].seasonalPrices[].pricePerNight | order(@ asc)[0]
}
`

/** Aktuelle Angebote/Pakete. */
export const ACTIVE_OFFERS_QUERY = `
*[_type == "offer" && isPublished == true && (validUntil == null || validUntil >= $today)] | order(orderRank asc) {
  _id, title, slug, season, price, pricePerPerson, minStay,
  "heroImage": gallery[0]{asset->{url}, alt}
}
`

/** FAQ nach Kategorie. */
export const FAQ_QUERY = `
*[_type == "faq"] | order(category asc, orderRank asc) {
  _id, question, answer, category
}
`

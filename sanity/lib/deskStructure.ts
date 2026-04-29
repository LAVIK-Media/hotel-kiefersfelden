import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import {
  DocumentTextIcon,
  ComponentIcon,
  HomeIcon,
  TagIcon,
  TagsIcon,
  CompassIcon,
  CommentIcon,
  HelpCircleIcon,
  CogIcon,
  MenuIcon,
  DocumentIcon,
  CalendarIcon,
} from '@sanity/icons'

/**
 * Custom Desk-Structure des Studios.
 *
 * UX-Prinzip:
 *   – „Speisekarte" ist Tages-Werkzeug → ganz oben.
 *   – Singletons (Site-Einstellungen, Navigation) erscheinen als feste
 *     Einträge ohne „neu anlegen"-Button.
 *   – Alle anderen Document-Types werden gruppiert nach Funktion.
 *
 * Hinweis: Die Singleton-IDs (`siteSettings`, `nav-header`, `nav-footer`,
 * `nav-footer-legal`) sind in `sanity.config.ts` und im Seed-Script
 * verankert — bitte nicht ohne Anpassung dort umbenennen.
 */

const SINGLETON_TYPES = new Set(['siteSettings', 'navigation'])
const SINGLETON_IDS = {
  siteSettings: 'siteSettings',
  navHeader: 'nav-header',
  navFooter: 'nav-footer',
  navFooterLegal: 'nav-footer-legal',
} as const

export const deskStructure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Inhalte')
    .items([
      // ────────────────────────────────────────────────────────────────
      //  KERN-WERKZEUG: SPEISEKARTE
      // ────────────────────────────────────────────────────────────────
      S.listItem()
        .title('🍽️  Speisekarte')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Speisekarte')
            .items([
              S.listItem()
                .title('Tageskarten')
                .icon(CalendarIcon)
                .child(
                  S.documentList()
                    .title('Tageskarten')
                    .filter('_type == "menu" && type == "tageskarte"')
                    .defaultOrdering([{ field: 'date', direction: 'desc' }])
                    .menuItems([
                      ...(S.documentTypeList('menu').getMenuItems() ?? []),
                    ]),
                ),
              S.listItem()
                .title('Wochenkarten')
                .child(
                  S.documentList()
                    .title('Wochenkarten')
                    .filter('_type == "menu" && type == "wochenkarte"')
                    .defaultOrdering([{ field: 'validFrom', direction: 'desc' }]),
                ),
              S.listItem()
                .title('Standardkarte')
                .child(
                  S.documentList()
                    .title('Standardkarte')
                    .filter('_type == "menu" && type == "standardkarte"'),
                ),
              S.listItem()
                .title('Saisonkarten (Spargel / Wild / Schlachtfest)')
                .child(
                  S.documentList()
                    .title('Saisonkarten')
                    .filter('_type == "menu" && type == "saisonkarte"')
                    .defaultOrdering([{ field: 'validFrom', direction: 'desc' }]),
                ),
              S.divider(),
              S.listItem()
                .title('Standard-Gerichte (wiederverwendbar)')
                .icon(ComponentIcon)
                .child(S.documentTypeList('menuItem').title('Standard-Gerichte')),
            ]),
        ),

      S.divider(),

      // ────────────────────────────────────────────────────────────────
      //  HOTEL & ZIMMER
      // ────────────────────────────────────────────────────────────────
      S.listItem()
        .title('🛏️  Zimmer & Ferienhaus')
        .icon(HomeIcon)
        .child(S.documentTypeList('room').title('Zimmer & Ferienhaus')),
      S.listItem()
        .title('Ausstattung (Amenities)')
        .icon(TagIcon)
        .child(S.documentTypeList('amenity').title('Ausstattungs-Bibliothek')),

      S.divider(),

      // ────────────────────────────────────────────────────────────────
      //  ANGEBOTE & ERLEBNIS
      // ────────────────────────────────────────────────────────────────
      S.listItem()
        .title('🎁  Angebote / Pauschalen')
        .icon(TagsIcon)
        .child(S.documentTypeList('offer').title('Angebote')),
      S.listItem()
        .title('🥾  Aktivitäten / Region')
        .icon(CompassIcon)
        .child(S.documentTypeList('activity').title('Aktivitäten')),

      S.divider(),

      // ────────────────────────────────────────────────────────────────
      //  CONTENT
      // ────────────────────────────────────────────────────────────────
      S.listItem()
        .title('📄  Seiten (Impressum, Datenschutz, AGB …)')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Seiten')),
      S.listItem()
        .title('💬  Gästestimmen')
        .icon(CommentIcon)
        .child(S.documentTypeList('testimonial').title('Gästestimmen')),
      S.listItem()
        .title('❓  FAQ')
        .icon(HelpCircleIcon)
        .child(
          S.list()
            .title('FAQ nach Kategorie')
            .items(
              [
                ['arrival', 'Anreise / Check-in'],
                ['rooms', 'Zimmer & Ausstattung'],
                ['restaurant', 'Frühstück & Restaurant'],
                ['pets', 'Tiere'],
                ['family', 'Familie & Kinder'],
                ['business', 'Geschäftsreisende & Tagung'],
                ['parking', 'Parken & Anreise mit Bahn'],
                ['accessibility', 'Barrierefreiheit'],
                ['booking', 'Stornierung & Buchung'],
                ['other', 'Sonstiges'],
              ].map(([cat, title]) =>
                S.listItem()
                  .title(title)
                  .child(
                    S.documentList()
                      .title(title)
                      .filter('_type == "faq" && category == $cat')
                      .params({ cat })
                      .defaultOrdering([{ field: 'orderRank', direction: 'asc' }]),
                  ),
              ),
            ),
        ),

      S.divider(),

      // ────────────────────────────────────────────────────────────────
      //  GLOBALE EINSTELLUNGEN (Singletons)
      // ────────────────────────────────────────────────────────────────
      S.listItem()
        .title('⚙️  Site-Einstellungen')
        .icon(CogIcon)
        .child(
          S.editor()
            .id(SINGLETON_IDS.siteSettings)
            .schemaType('siteSettings')
            .documentId(SINGLETON_IDS.siteSettings),
        ),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(
          S.list()
            .title('Navigation')
            .items([
              S.listItem()
                .title('Header (Hauptmenü)')
                .child(
                  S.editor()
                    .id(SINGLETON_IDS.navHeader)
                    .schemaType('navigation')
                    .documentId(SINGLETON_IDS.navHeader),
                ),
              S.listItem()
                .title('Footer (Hauptmenü)')
                .child(
                  S.editor()
                    .id(SINGLETON_IDS.navFooter)
                    .schemaType('navigation')
                    .documentId(SINGLETON_IDS.navFooter),
                ),
              S.listItem()
                .title('Footer (Rechtliches)')
                .child(
                  S.editor()
                    .id(SINGLETON_IDS.navFooterLegal)
                    .schemaType('navigation')
                    .documentId(SINGLETON_IDS.navFooterLegal),
                ),
            ]),
        ),

      // Standard-Liste der übrigen Typen ausblenden, weil sie oben
      // bereits gruppiert erscheinen
      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            'menu',
            'menuItem',
            'room',
            'amenity',
            'offer',
            'activity',
            'page',
            'testimonial',
            'faq',
            'siteSettings',
            'navigation',
          ].includes(item.getId() as string),
      ),
    ])

export { SINGLETON_TYPES, SINGLETON_IDS }

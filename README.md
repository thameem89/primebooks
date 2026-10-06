# PRIME Book Distribution website

A local Next.js App Router / TypeScript implementation of the supplied website brief. The supplied PDF logo was exported to WebP with its artwork and proportions preserved. The website has not been deployed. Source is maintained at https://github.com/thameem89/primebooks.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production-mode local preview, run `npm run build` followed by `npm start`.

## Pages and routes

- `/` — editorial homepage, search, selected books, company introduction, services, publishers, network, partnership CTAs and illustrative bookstore imagery.
- `/books` — searchable catalogue, category/publisher/language/availability/year filters, featured/newest/title/author sorting, URL parameters, result count and empty state. Mobile filters use a native dialog sheet with keyboard focus containment and Escape dismissal.
- `/books/[slug]` — description, author biography, compact publisher information, bibliographic metadata, related titles and a book-prefilled enquiry link.
- `/publishers` and `/publishers/[slug]` — publisher directory, compact profiles and associated titles.
- `/distribution` — publisher, bookstore and reader distribution flows.
- `/register/publisher` and `/register/bookstore` — business expressions of interest.
- `/about` — company introduction, proposed mission/vision/philosophy, people/network content and imagery.
- `/contact` — general and book-specific enquiries.
- `/privacy` and `/terms` — clearly identified local-preview notices, awaiting final client legal copy.
- `/api/submissions` — validated POST handler; no public read endpoint.
- `/robots.txt`, `/sitemap.xml` — preview indexing is disabled; sitemap and canonical URLs use `SITE_URL`, defaulting to localhost.
- Custom 404, contact loading state and retryable error boundary.

Page metadata includes unique titles, descriptions, canonical links and Open Graph data. Book pages include Book JSON-LD. Before public launch set `SITE_URL` and update indexing rules after replacing demonstration content.

## Catalogue and assets

`lib/catalogue.json` contains 16 fictional books, 4 fictional publishers and associated author descriptions. The repository layer is `lib/data.ts`; it can be replaced with a real database API while retaining the UI. Search matches titles, authors, ISBNs, publishers, categories and descriptions. The generated local SVG covers are original placeholder artwork; no commercial covers were copied. The bookstore photograph is generated illustrative imagery and is labelled as such. It does not depict a PRIME location.

Prices are optional informational fields in the model and currently null. The implementation contains no cart, purchasing accounts, checkout, ordering, payment processing or independent-author platform.

## Forms and persistence

Enquiries and applications are stored as individual JSON files in `data/submissions/`, outside public assets and excluded from Git. Records have a UUID, creation time, form kind and review status. Book enquiries retain the selected book ID. Files use restrictive filesystem permissions. Input is validated on the server, with required fields, email validation, consent, field-size limits, a honeypot and same-host origin checks. Browser forms expose saving, success and error feedback and state clearly that records are stored locally and not sent to PRIME.

This filesystem adapter is intended for this local build. Connect a durable database and notification delivery before using the forms on hosted infrastructure, where local files may be ephemeral. Supabase was not already configured and no credentials were supplied, so no external database was provisioned.

## Admin

No internal admin UI or authentication was configured. There are no public routes that expose submissions. A production protected CMS should be added with PRIME's chosen identity provider/backend after access requirements are supplied. Books and publishers are currently maintained in `lib/catalogue.json`.

## Verification — 6 October 2026

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm test`: 2 catalogue integrity/content tests passed.
- `npm run test:integration`: 3 tests passed, covering every public route and demo book/publisher detail route, HTTP 404s, rejected invalid/cross-origin/unconsented requests, and successful persistence of all three form kinds. Requires the local server to be running.
- `npm run build`: passed.
- Browser-tested catalogue search, Fiction filter (4 results), reset/empty state, book detail → prefilled enquiry, publisher navigation, mobile navigation dismissal and all three form submissions.
- 70 responsive DOM checks over the ten main page types at 390, 430, 768, 1024, 1280, 1440 and 1920px: no horizontal overflow or broken loaded images. Mobile checks included 390 × 844 and 430 × 932.
- Desktop and mobile screenshots were visually inspected. Screenshots are in `output/`.
- Browser console had no errors or warnings at the final desktop inspection.
- Dependency audit reported 5 high advisories in the development-only ESLint → glob → braces dependency chain, and none in runtime dependencies. The suggested automatic fix would downgrade Next's ESLint configuration across major versions; it was not applied. Review a compatible patched toolchain before launch.

## Remaining PRIME content and configuration

Supply real book covers, titles, ISBNs, metadata, author biographies and publisher information; approved company story, mission/vision and distribution regions; team and distributor photographs; verified phone/email, office address, business hours and social profiles; final legal copy; and backend/authentication/delivery configuration. Uploads and protected admin management remain future backend work.

Typography uses Google Fonts with local Georgia/Arial fallbacks. The site does not currently include analytics or tracking.

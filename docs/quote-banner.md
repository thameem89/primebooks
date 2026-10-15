# PRIME featured quote banner

One client component below Featured Books. Existing catalogue, hero, metadata, navigation and forms are preserved. No deployment has been performed.

## Content and rights

Edit `lib/quotes.ts`: six quotations, works, primary-source URLs, portrait credits and public-domain file-page URLs are kept together. Text was checked against the linked Project Gutenberg editions. Alcott's excerpt is Amy's dialogue in chapter 44 of *Little Women*, not a claimed autobiographical statement. Dickinson and Stevenson use poetry excerpts with line breaks normalized to spaces. The portraits' Wikimedia Commons description pages mark them public domain. Local WebP copies are resized for delivery; originals were not otherwise retouched. Attribution and source credits are available beneath the banner; no endorsement is implied.

No client reference screenshot was attached to this request. The design follows the supplied layout description and existing PRIME palette and typography.

## Behaviour

Server and initial hydration render the same fixed-size placeholder. After mount, a Fisher–Yates shuffle selects the first quote. A shuffle bag exhausts all six quotes before an automatic repeat; its next cycle cannot begin with the previous cycle's final quote. Previous and pagination intentionally allow readers to revisit quotes manually. Manual actions reset the seven-second timer. Pointer hover, keyboard focus, document visibility, reduced-motion preference and the explicit pause control are independent pause reasons. Leaving one pause does not cancel another. Reduced motion disables autoplay and the fade; manual controls remain available.

`useSyncExternalStore` subscribes to the controller. There are no per-second renders. Cleanup removes timers/listeners. The text, attribution and portrait share a single fade layer. Six small portraits are predecoded. Banner and credit-strip space is reserved before hydration and remains constant as quotes change. Opening source credits deliberately expands the credit text.

## Verification

Commands:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `node --test scripts/quote-rotation.test.mjs`
- `TEST_URL=http://localhost:3001 npm run test:integration`
- `npm run build`

Controller tests cover randomized initialization, 3,600 shuffle draws across seeds, complete cycles, cycle-boundary repeats, seven-second timing, each pause reason, overlapping pauses, manual history/pagination, reset countdowns and reduced-motion manual navigation. Reduced-motion timing is tested with a deterministic controller and mocked timers; CSS also removes animation under the native media query.

Browser checks cover each quote at 390, 430, 768, 1024 and 1440 pixels: a single visible quote, constant banner height, no horizontal overflow, no text/control overlap and loaded portrait assets. Live autoplay, hover and keyboard focus are checked separately. Screenshots: `output/quote-banner-desktop.jpg` and `output/quote-banner-mobile.jpg`.

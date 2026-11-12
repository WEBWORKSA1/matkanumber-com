# Phase-wise build prompt: MatkaNumber.com

Use these prompts in order to rebuild or extend the site. Each phase names its deliverables and its acceptance test.

## Global rules (apply to every phase)
- Concept: "Pull a number from the matka." Fair-draw tools, a number library and probability education. **No gambling results, charts, tips, predictions, betting links or betting advertisers anywhere.**
- Stack: Jekyll on GitHub Pages free plan, branch `main`, root folder. Plain HTML, CSS and JavaScript. No build tools, no server, no database.
- Top of every page: a bar reading "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership", linked to `https://web.works/contact`.
- One inbox for every form. The address must never appear in page text or source: decode it at send time from an encoded key in `assets/js/config.js`.
- AdSense: client `ca-pub-6620975821265271`; script in `<head>`, `google-adsense-account` meta tag, `ads.txt` at root.
- All internal links use `relative_url` so the site works on both the preview path and the custom domain.
- Include the trademark and copyright disclosure and link it from every footer.

## Phase 1: Foundation
Prompt: "Create `_config.yml` (title, tagline, description, url, baseurl, AdSense client, owner contact, jekyll-sitemap, layout defaults for `tools`, `learn`, `numbers`). Create `_layouts/default.html` with the owner bar, sticky header and nav, main slot, lead band include, footer with disclosure, cookie notice, JSON-LD and script tags. Create `assets/css/style.css` with a clay, marigold and indigo palette, Fraunces + DM Sans, responsive grid, visible focus states and reduced-motion support. Add `ads.txt`, `robots.txt`, `site.webmanifest`, an SVG pot icon and `404.html`."
Accept when: every page shows the owner bar, the nav collapses under 900px, and Lighthouse reports no contrast failures.

## Phase 2: The pot and the home page
Prompt: "Build `_includes/pot.html` (SVG clay pot with a chit that pops out) and a home page with: hero and live draw (one, two or three digits), number of the day, tool grid from `_data/tools.json`, six lesson cards, three videos, contest/advertise/support cards and an FAQ. Use the browser's cryptographic random source with rejection sampling for every draw."
Accept when: the draw animates, shows a zero-padded result and links to that number's page.

## Phase 3: Tools
Prompt: "Create nine tool pages using `_layouts/tool.html` (tool, how-to, explanation, FAQ, sidebar of other tools): Matka Draw (entries, multiple winners, remove winners, dedupe, session history, copyable draw record with SHA-256 fingerprint), Random Number Generator (range, count to 10,000, no repeats, sort, copy, CSV), Odds and Expected Value Calculator (1-in-N, payout, stake, rounds, return to player bar, simulation), Dice Roller, Coin Flip (stats, streak), Number Checker (prime, factors, divisors, bases, Roman, words), Number to Words (international and Indian), Roman Numerals (both ways), Numerology (labelled entertainment). Put all logic in `assets/js/tools.js`."
Accept when: each tool handles empty and invalid input with a plain message and no console errors.

## Phase 4: Number library
Prompt: "Generate `_data/numbers.json` for 0 to 99 (English words, romanised Hindi, Roman, binary, hex, optional fact) and 100 stub pages `numbers/<n>.html`. `_layouts/number.html` computes divisors, prime status, square, cube, digit sum and Devanagari digits in Liquid and explains the number's odds in a pot draw. Add an index grid that highlights today's number."
Accept when: `/numbers/7.html` shows prime, divisors 1 and 7, binary 111 and Hindi 'saat'.

## Phase 5: Lessons and videos
Prompt: "Write nine Markdown lessons in `learn/`: what matka means, why number betting loses, is matka legal in India, the gambler's fallacy, how random number generators work, how to run a fair giveaway draw, the Indian numbering system, numerology fact or fiction, help for gambling problems. Each 400 to 700 words, original, with internal links to tools. Add `videos.html` with click-to-load YouTube players from `_data/videos.json` (verify every ID through YouTube oEmbed first)."
Accept when: no lesson explains how to place a bet, and every legal claim names its law.

## Phase 6: Lead generation
Prompt: "Add `_includes/lead.html` on every page: Fair Draw Kit + weekly email signup (name, email, interest, consent, honeypot) that redirects to `draw-kit.html?welcome=1`. Write the kit: rules template, ten-point checklist, results announcement. Add `advertise.html` with packages and a qualified lead form (company, interest, budget, timing). Record first landing page with each submission."
Accept when: a test submission reaches the inbox and the address cannot be found by searching the built site.

## Phase 7: Contributions, contest, careers
Prompt: "Build `support.html` (where money goes: operations, promotion, hiring, contests and prizes; tiers; payment buttons from `config.js`; pledge form), `contest.html` (free monthly puzzle from `config.js`, countdown, entry form, rules: free entry, 18+, public draw, void where prohibited) and `careers.html` (roles and application form)."
Accept when: the contest shows this month's puzzle and a live countdown, and no page asks for payment to enter.

## Phase 8: Trust, policy and AdSense readiness
Prompt: "Write `about.md`, `privacy.md` (AdSense cookie disclosures, opt-out links, form processor, local storage), `terms.md`, `disclaimer.md` (not a gambling site; trademark and copyright disclosure) and `contact.html`. Check every page has unique title and description, real content above any ad, working navigation and no placeholder text."
Accept when: the site passes a manual read against the AdSense programme policies and Publisher Policies, with special attention to the gambling policy.

## Phase 9: Automation and launch
Prompt: "Add `.github/workflows/daily-refresh.yml` to commit `_data/build.json` daily so Pages rebuilds and the home page shows the day's number statically. Push to `WEBWORKSA1/matkanumber-com` on `main`, enable Pages from the branch root, then point the custom domain (README has the steps) and apply for AdSense."
Accept when: the preview URL loads, `/ads.txt` and `/sitemap.xml` resolve, and the daily workflow has run once.

## Phase 10: Growth backlog
- Hindi and regional-language versions of tools and lessons.
- Number pages for 100 to 999 once the first hundred are indexed.
- Spinner wheel, team splitter, list shuffler, lottery-odds explainer for licensed state lotteries.
- Embeddable draw widget with a "Powered by MatkaNumber" link.
- Teacher pack: classroom probability experiments as a second lead magnet.
- Published contest draw records and a winners archive.

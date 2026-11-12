# MatkaNumber.com

An independent numbers site built on the plain meaning of the name: a *matka* is a clay pot that numbers are drawn from.

1. **Draw** – fair random draws (name and ticket picker with a publishable record, random number generator, dice, coin).
2. **Know** – a page for every number 0 to 99, plus number checker, number-to-words (lakh/crore), Roman numerals, numerology (entertainment).
3. **Learn** – nine lessons on probability, the law, fair giveaways and why number betting loses, plus a YouTube video library.

It also carries lead generation (Fair Draw Kit and weekly email, advertising enquiries), supporter contributions, a free monthly puzzle contest with prizes, careers, and a trademark/copyright disclosure.

**It deliberately contains no gambling results, charts, tips or betting links.** That is what keeps it eligible for Google AdSense, which does not allow gambling content without certification.

Live preview (GitHub Pages): `https://webworksa1.github.io/matkanumber-com/`

## How the site is built
Plain Jekyll, built by GitHub Pages itself (free plan, branch `main`, folder `/ (root)`). No server or database.

| Path | What it is |
|---|---|
| `_config.yml` | Site settings: URL, base path, AdSense client, owner-contact link |
| `_layouts/` | `default` (owner bar, header, footer, AdSense, cookie notice, JSON-LD), `tool`, `article`, `number`, `page` |
| `_includes/` | `lead.html` (lead capture band on every page), `pot.html` (the animated pot) |
| `_data/` | `tools.json`, `videos.json`, `numbers.json` (0 to 99), `build.json` (daily stamp) |
| `tools/`, `learn/`, `numbers/` | Tool pages, lessons (Markdown), number pages (stubs rendered by `_layouts/number.html`) |
| `assets/js/config.js` | **Edit me:** payment links, contest prize and puzzles, form relay key |
| `assets/js/main.js` · `tools.js` | UI, forms, number of the day, contest countdown · all nine tools |
| `.github/workflows/daily-refresh.yml` | Daily commit so Pages rebuilds and the home page shows the new number of the day |
| `PROMPTS.md` · `RESEARCH.md` | Phase-wise build prompts · research on 38 comparable sites (not published) |

**Add a tool:** create `tools/<slug>.html` (front matter `title`, `description`, `tooljs: true`), add its logic to `assets/js/tools.js` and a line to `_data/tools.json`.
**Add a lesson:** create `learn/<slug>.md` with `title`, `description`, `order`, `read`.
**Add a video:** append to `_data/videos.json` (YouTube ID, title, channel, one-line reason).

## Publish on GitHub Pages (one-time)
Settings → Pages → Build and deployment → Source **Deploy from a branch** → Branch **main**, folder **/ (root)** → Save.

## Custom domain (MatkaNumber.com) – required for AdSense approval
The domain currently forwards to a for-sale lander, so the site ships on the preview URL. To switch:
1. DNS at the registrar: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `webworksa1.github.io`. Remove the forwarding.
2. Add a file named `CNAME` in the repo root containing `matkanumber.com`.
3. In `_config.yml` set `url: "https://matkanumber.com"` and `baseurl: ""`. Commit.
4. Settings → Pages → tick **Enforce HTTPS** once the certificate is issued.

## Forms
All forms (Draw Kit and newsletter, contact, contest entry, pledge, advertising lead, careers) post through FormSubmit to the owner inbox. The address is decoded at send time from the `relay` key in `assets/js/config.js` and never appears in page source or page text.
- **The first submission triggers a one-time FormSubmit activation email. Click Activate**, or later submissions are not delivered.
- After activation FormSubmit provides a random alias. Paste it into `formAlias` in `config.js` and the encoded address is no longer used.

## Contributions
Paste PayPal / Stripe / Buy Me a Coffee / Ko-fi / Razorpay / UPI links into `config.js` → `payments`. Until then the Support page runs in pledge mode.

## AdSense
- The tag for `ca-pub-6620975821265271` is in the `<head>` of every content page, with the `google-adsense-account` meta tag on all pages. It is left off `contact.html` and `404.html`.
- `ads.txt` is at the root.
- Apply after the custom domain is live. After approval: turn on Auto ads, and enable the Google-certified consent message for EEA/UK/CH under Privacy & messaging (the privacy page already describes it).
- Keep the site free of betting content, betting advertisers and outbound betting links.

## Trademark / copyright
See `disclaimer.md`. "MatkaNumber" is used as the descriptive name of this website and domain, with no affiliation to any lottery, betting operator, app or brand using "Matka" or "Matka Number". No third-party logos are used, and videos are embedded only through YouTube's player.

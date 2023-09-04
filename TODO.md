Admin Improvements
- Improved data auditing
  - Pages to easily see missing: sources, market segment, release date, launch price, company
- Add protections against human errors
  - Add confirmations to deleting anything (cpu, gpu, user)
  - Stricter validators
- Better error handling
  - Show errors on forms
- Add soft delete functionality. Hard deleting should be rare

Analytics:
- More metrics
  - Button clicks

Automation:
- Add more scrapers as they're needed
  - Intel website
  - AMD Website
  - Wikichip
- Improve automation autocomplete
  - Remove retail models from chipset autocomplete
  - More options
  - Better sort (maybe by name? non-archived first?)
- Reduce update frequency of gpu retail models (except for price)
- Reduce update frequency of old products
- View processing / failed automation actions.
  - Add ability to requeue

Content:
- Synthetic performance score. Compute a score based on available data.
  - Can predict data based on gpus with similar scores in other benchmarks
- Use consistent naming like "(OEM)" and "(Mobile)"
- Fill in any missing release date quarters
- Add articles
- Add glossary
- Add ability to overwrite generated summaries for view and compare
  - Useful for common queries
- Add popular searches below autocomplete on home and list pages.
- Add more sorts and filters to list pages
  - Sort: Most Expensive / Cheapest for MSRP & Current Price
  - Filter: Year, Price Range, Availability
- Add more benchmarks
  - More 3D Mark benchmarks
  - FPS averages for popluar games
  - Estimate based on similar (if enough data is provided)

Monetization:
- Join amazon affiliate for other major countries
- Sign up for Adsense
- Expand content for more ads
  - View page, Compare page, list page
- Integrate with Amazon API (when qualified)
  - Live pricing and availability
  - Can add spinner for getting price

Performance:
- Audit and log DB Queries
  - Use "EXPLAIN" on logged queries
- Add caching to pages
- Add caching to api calls
- Improve usage of transactions
  - Minimize usage of them for read-only operations.

Security:
- DDOS protection with Cloudflare
  - Whitelist my own ips
- Expose associate key without NEXT_PUBLIC
  - Due to being injected at build time.
- Setup weekly backups on host
- Setup auto backups, particularly database
- Add recaptcha to list page
- Rate limit non-staff api calls

Tech Debt:
- Write README
- Explore combined products table
  - Write design doc for this
  - Separate tables for specs, benchmarks, sources
- Setup separate table for product sources instead of a meta column
  - Faster to auto-archive, can auto-archive as we find sources.
- Setup separate table for benchmarks
  - Keep a general performance score and value score on products tables for better
    sorting. Can store other benchmark values
- Update major dependencies
  - Nextjs, Nestjs, TypeScript
- Replace axios with fetch
- Get rid of index.ts barrel files on api and website (only needed for libraries)
- Simplify UI components
  - More shared components when we can.
  - Simpler component code, no one component should do too much.
  - Loops should always point to another component.
- Add more logging to api and nextjs
  - API calls
  - Database queries
  - Metrics (how long it took for a query to execute)
- Seamless deployment
  - Use docker to build on pc instead of server
  - Use docker for running on production
- Remove TS classes in client code. Only use functions (except for maybe api client).
- Improve consistency of where state, memo, callbacks, effects are placed in component code
  - Order: States, Memos, Callbacks, Effects
- Improve DX of View Models
  - One "model" or "viewModel" prop on each page props
  - Separate "errors" property on each page props
- Generalize product list objects:
  - migrate gpu and cpu to use ListPagination, ListOrder, ListSort
  - Update ListCpusQuery and ListGpusQuery to use generalized ListQuery type.
- Move common utilities to shared
- Minimize 3p dependencies in shared
  - Due to some not working in browser or only working in server
- Setup consistent folder structure in client code
- Controller should be minimal
  - Move validation to service.
  - Getting count should be in same server method as fetching results.
  - Service should handle constructing response
- Improve API Consistency
  - GET parameters (jsonify everything?)
  - *Request, *Response naming?
- Improve tailwind config:
  - max/min media queries

UX:
- Improve product autocomplete
  - More options - 6 is not enough
  - Improve quality - sometimes not getting exact match first
- Explore linking to retail models on gpu chipset page, instead of dialog.
- More spinners when loading data.
- Audit accessibility.
- Improve pagination, get rid of legacy pagination.
  - Treat each like a new page.


Road Map:
- improve view/compare relative performance/value
  - toggle market segments, default to same market segment

- improve list page style
  - list of cards, can show more data in a prettier way
  - better for fitting in ads
- improve automation
  - pull in new data
  - two core DO server
- compare page overview improvements
  - add architecture
  - add ranks?
  - add cores?
- view page overview improvements
  - Use ai to reword sentences
  - Restructure code to similar to the compare page.
- audit data
  - turn off auto-update on static specs
    - maybe a freeze button which toggles off auto-update
- view page overview
  - use ai to reword sentences.
  - add memory
  - add cores?
  - Restructure code to similar to the compare page.



OVERVIEW
- Use "chip" instead of "card" for mobile and integrated gpus



AMAZON AFFILIATE
- Can cache pricing, but must show as-of date.
- Use Product Advertising API to get pricing and link
- Automation for pricing
- Cannot do price tracking
- Chipset goes to lowest price new retail model


CODE CLEANUP IDEAS
- migrate gpu and cpu to use ListPagination, ListOrder, ListSort
- cleanup shared
  - pure utilities
  - no dependencies that are browser or backend only
- centralized location for company names
- centralized location for field key -> label
- cleanup utilities
  - more gpu field utils
    - are equal, compare, has value
- scraping
  - Don't call individual scrape functions, pass data sources instead.
  - Don't include ScrapeGpuDetailsResponse in scraper.
    - Just use scrape results type.
- symlink public folder to outside of packages?
- change "base" text value to 16px, not 18px.
- improve folder structure
    - look at List GPUs page for example
    - <feature>/pages/<page-name>/components/
      - Components only used on the page for this feature.
    - <feature>/pages/<page-name>/hooks/
      - Hooks only used on the page for this feature.
    - <feature>/components/
      - Components used across multiple pages for this feature.
    - <feature>/hooks/
      - Hooks used across multiple pages for this feature.
    - TODO: where to place utils and services?
    - folders and files should use PascalCase and camelCase except for package folders
- improve usage of react components - break down into smaller
- remove usage of router.push
- get rid of, or improve gpu and image cache

CONTENT IMPROVEMENTS
- "targets the <segment> GPU market"
- relative performance and relative value should be filtering based on market segment
- content: add rank for company performance. Figure out how to do db query
- Add FPS benchmarks


 

Post-launch:
- remove usage of router.push.
- set up auto backups
- add audit events table
  - track all changes to content
- List Page
  - filtered rank
  - infinite scroll
- View and Compare Page
  - Add tooltips for each spec
  - look into using useController
- on-site SEO
  - Add alt tags
  - html semantics
  - sitemap
  - improve canonicals
- improve related parts
- improve admin panel


Roadmap:
Legend:
- CTNT = Content
- LEGL = Legal
- EFFY = Efficiency
- MRKT = Marketing
- LYLT = Loyalty
- DIFF = Differentiator
- MVP
  - [CTNT] GPUs
  - [CTNT] Compare
  - [CTNT] Home Page
  - [LEGL] About
  - [LEGL] Privacy
  - [EFFY] Basic admin panel
- 1.0.1
  - [EFFY] Set sources on pc parts, automate pulling data (but require approval)
  - [CTNT] Summaries for view/compare
- 1.1
  - [CTNT] CPUs
- 1.2
  - [EFFY] Admin Task Queue & Simple Flows
  - [EFFY] Pseudo-automation
  - [CTNT] Articles / Blog
  - [MRKT] Start offsite SEO
- 1.3 
  - [DIFF] More Parts - MOBO, RAM
  - [LYLT] Accounts
  - [LYLT] Save Parts
  - [CTNT] Build Tutorials
- 1.4
  - [DIFF] More Parts - HDD, PSU, Case
  - [CTNT] Builds
  - [LYLT] User-created builds
- 1.5
  - [DIFF] Build Wizard Generator
    - Answer questionaire, build gets generated
  - [MRKT] Share Builds
- 1.6
  - [DIFF] Laptops
  - [MRKT] Start social media campaigns
- 1.7
  - [LYLT] Community / Forum

Start small

SEO Ideas
  - On-site:
    - Improve performance
    - Create sitemap
  - Off-site:
    - Create backlinks
      - Github repos, couple legitimate directories, write articles
    - Post to Reddit and other similar social media


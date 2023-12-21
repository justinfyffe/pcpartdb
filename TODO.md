Primary Focus:
- List UI Improvements
- Articles
- Ads

List UI Improvements:
- Add more verticality to page.
  - [] Stuff above the table?
  - [] Stuff below the table?

Scraping Improvements:
- Support GPU Clock from TechPowerUp:
  - https://www.techpowerup.com/gpu-specs/geforce-gtx-460-v2.c356

- ALTERNATIVE:
  - Get rid of "Performance Score" and "Performance Per MSRP". Just use benchmarks and benchmark / $
    - On list page, add option to select benchmark for "Best Performance" and "Best Value"
      - Persist among each page (using local storage / cookie)
      - Show raw number, don't bother with normalizing to 100.0?
    - On View/Compare page, add ability to select benchmark, persist among each page.
      - Persist among each page (using local storage / cookie)
      - "Performance Rating" and "Value Rating" will be based off of this.
      - Show raw number, don't bother with normalizing to 100.0?
- figure out how to handle when the strongest product lacks some benchmarks
- figure out if using existingPredictionKeys or existingPredictionKeys2
- figure out weights
- figure out estimate factor
- figure out benchmarks to use

- Delete hanging benchmarks
  - where product_id is null. they're not deleting.

When Bored:
- Migrate to react-query instead of axios
- Make autocomplete stricter, not looser when searching?
- Improve db performance using queryRaw, but only in places where it'll help 

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
  - Notebook Check
  - Intel Website?
  - AMD Website?
- Improve automation autocomplete
  - Remove retail models from chipset autocomplete
  - Better sort (by date added/updated? maybe by name? non-archived first?)
- Reduce update frequency of gpu retail models
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
- Toggle market segment for relative performance/value tables
- Use "chip" instead of card for mobile and integrated graphics
- Add tooltips explaining specs from glossary
- Increase length of content
  - Add charts, more summarized text, etc.
  - Look at other comparison sites for inspiration
- GPU Specs to Add
  - Pixel Shaders
  - Vertex Shaders
  - Vertex Rate
  - Die Size

Monetization:
- Join amazon affiliate for other major countries
- Sign up for Adsense
- Expand content for more ads
  - View page, Compare page, list page
- Integrate with Amazon API (when qualified)
  - Live pricing and availability
  - Can add spinner for getting price
- Improve affiliate link locations
  - Move to above scroll

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
- Setup separate table for fields
  - Keep a general performance score and value score on products tables for better
    sorting. Can store other benchmark values
- Get rid of index.ts barrel files
- Use prisma for migrations and schemas, use kysely for querying, use prisma-kysely for generating types
- Update major dependencies
  - Nextjs, Nestjs, TypeScript, Prisma
- Replace axios with fetch
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
  - can we just build prisma client on server, nothing else
- Remove TS classes in client code. Only use functions
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
- symlink public folder to outside of packages?
- remove usage of router.push
- get rid of, or improve gpu and image cache
- Create seed scripts for dev database

UX:
- Improve product autocomplete
  - More options - 6 is not enough
  - Improve quality - sometimes not getting exact match first
- Explore linking to retail models on gpu chipset page, instead of dialog.
- More spinners when loading data.
- Audit accessibility.
- Improve pagination, get rid of legacy pagination.
  - Treat each like a new page.


Folder Structure Ideas
  - look at List GPUs page for example
  - <feature>/pages/<page-name>/components/
    - Components only used on the page for this feature.
  - <feature>/pages/<page-name>/hooks/
    - Hooks only used on the page for this feature.
  - <feature>/components/
    - Components used across multiple pages for this feature.
  - <feature>/hooks/
    - Hooks used across multiple pages for this feature.
  - <feature>/utils/
    - Utils used across multiple pages for this feature.
  - <feature>/services/
    - Services used across multiple pages for this feature.
  - folders and files should use PascalCase and camelCase except for package folders

SEO Ideas
  - Off-site:
    - Create backlinks
      - Github repos, helping on forums, write articles
    - Post to Reddit and other similar social media


Roadmap:
- CTNT = Content
- LEGL = Legal
- EFFY = Efficiency
- MRKT = Marketing
- LYLT = Loyalty
- DIFF = Differentiator
- [CTNT] Articles / Blog
- [MRKT] Start offsite SEO
- [DIFF] More Parts - MOBO, RAM
- [LYLT] Accounts
- [LYLT] Save Parts
- [CTNT] Build Tutorials
- [DIFF] More Parts - HDD, PSU, Case
- [CTNT] Builds
- [LYLT] User-created builds
- [DIFF] Build Wizard Generator
  - Answer questionaire, build gets generated
- [MRKT] Share Builds
- [DIFF] Laptops
- [MRKT] Start social media campaigns
- [LYLT] Community / Forum

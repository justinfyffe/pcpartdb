NEXT (long-term):
- Migrate to a ui framework
- v2.0
  - Migrate to a headless cms (e.g. PayloadCMS)
- Verify inmobi choice
- Sitemaps:
  - upload sitemaps in a zip file, and unzip
- Tech Debt
  - Migrate from axios to fetch
  - Seamless deployment.
    - do we even need to stop the service to build?
- SEO Improvements


NEXT (short-term)
- SEO improvements
  - [] Improve generated summaries
    - Use AI to help come up with variations.
    - delete overwritten summaries and fields
- Tech debt?
  - [] Improve Content code
    - [] Combine tags / deps
    - [] Add "and" and "or" options
- List Page
  - Soft reload when changing benchmarks
  - More Filters
    - Release Date (Year)
    - Game for FPS
  - More sorts:
    - Frames per second
    - Cost per frame
  - Use Mantine or another ui framework
- [] Games Page
  - [] List Games Page
    - Mention how many gpus have FPS for it
  - [] View Game Page
    - Data:
      - Game Image
      - Game Name
      - Publisher
      - Developer
      - System requirements
      - Summary
      - Metacritic score
    - List GPUs by frame rate and cost per frame
- [] View & Compare Page
  - [] FAQ section (custom questions and generated questions)
- [] Builds
  - [] List Page
    - Filter by Tags, Can it Run?
    - Vertical widget
  - [] View Build Page
  - [] Admin
  - [] DB
    - Build
      - Name
      - Summary
      - Article
      - ImageId?
      - BuildPart[]
    - BuildBuildPart
      - BuildId
      - BuildPartId
    - BuildPart
      - Name
      - ProductId?
      - ImageId?
      - Affiliate Link
      - Initial Price
      - Initial Price Date
      - As Of Price
      - As Of Date
    - BuildTag
  - [] Other
    - Update prices from newegg and amazon
      - Amazon API
      - Newegg API
    - Short link for ig
- [] Bug fixes
  - [] Upload related products times out
- [] UI improvements
  - [] List - Use overlay for mobile filters
    - Dim the outer part of the overlay?
    - make it easy to close
    - maybe expand it fully, no scroll?
  - [] Add larger section descriptions?
    - [] Gaming Performance
    - [] Benchmark Performance
  - [] Update section descriptions for CPUs
  - [] Add Performance to General Info
    - [] View CPU
    - [] View GPU
    - [] Compare CPUs
    - [] Compare GPUs
  - [] Add Performance Per Dollar to General Info
    - [] View CPU
    - [] View GPU
    - [] Compare CPUs
    - [] Compare GPUs
  - [] Add Gaming Performance to highlights
    - [] View GPU
    - [] Compare GPUs
  - [] Clean up highlights
    - [] Remove less important data
  - [] add underlines to links on hover
- [] SEO
  - Off-site
  - On-site
    - Add text content on various pages
      - list page
    - Improve titles
      - Name1 - Benchmarks, Specs, and Game Performance
      - Name1 vs Name2 - Benchmarks, Specs, and Game Performance
    - Improve keyword usages
    - Improve auto-generated summary
- [] code cleanup
  - more prefabs
  - Simplify react components
- [] Improve SEO
- [] Home Page Revamp
  - [] More text for seo
  - [X] Change compare form button color
  - [] Section: Compare GPUs
    - Featured comparison?
    - Under form, show popular GPUs
  - [] Section: Compare CPUs
    - Featured comparison?
    - Under form, show popular cPUs
  - [] Remove article widgets
- [] Automation
  - [] Add accept/reject button to dialog
- [] UI Revamp?
  - Look at pc-builds.com
- [] Add more games

- [] Bug Fix
  - Admin games list not showing all games
  - not impacting impact view/compare dialog
- [] Games Post-MVP
  - [] Scroll to section using js instead of using anchor
    - [] Replace duct tape window.history?.replaceState
  - [] Add Games to List GPUs page
    - [] Sort
    - [] Select Game + Preset
  - [] Add FPS by preset, listing all games

Automation Improvements:
- Audit
- CPU
  - Handle "(per core)" and "(shared)" for CPUs
    - Show (per core) and (shared), or specify 4x256kb
    - https://www.techpowerup.com/cpu-specs/core-i5-2500k.c725
- GPU
  - Support "Memory Clock (effective)" field
    - https://www.techpowerup.com/gpu-specs/firepro-w5170m.c2705
  - Support "Shader Clock" field
    - https://www.techpowerup.com/gpu-specs/radeon-rx-7900-xtx.c3941
  - Add Predecessor
  - Add Successor
  - "handle (per sm) for l1 cache":
    - https://www.techpowerup.com/gpu-specs/geforce-rtx-4090.c3889
- Error Handling
  - Add ability to restart a failed job
  - Store failed tasks to look at later

Games / FPS:
- Fixes:
  - [] Scroll to section using js instead of using anchor in Contents
    - [] Replace duct tape window.history?.replaceState
  - Improve performance
    - Most important:
      - [] Exclude unused data
        - Possibly impactful for reducing data on some gpus
        - Search text, other names
      - [] Cache slug -> id?
        - Might improve performance with looking up product ids. up to 20ms
      - [] Reduce data in client components
        - Unknown impact
        - Might reduce data needed to front-end
    - view and compare gpus are slow
      - Slow: https://pcpartdb.com/gpus/view/nvidia-geforce-rtx-4090/
      - Fast: https://pcpartdb.com/gpus/view/intel-uhd-graphics-770/
    - view and compare cpus are still pretty fast
    - deepmerge is slow. Look at other libraries.
- POST MVP
  - [] List GPUs
    - [] Sort
    - [] Select Game + Preset Dialog
  - Add fps tables for all games in settings preset tabs
  
- Milestone 1 (April 2024):
- Milestone 2 (?):
  - Game Page
    - Features
      - Game Info
        - System Requirements
        - Publisher
        - Developer
        - Release Date
        - Metacritic
        - Description  
      - FPS for best performance
      - FPS for best value
      - Can I run it?

- List Pages Improvements
  - More sorts
  - More filters
  - Improved UI

Admin Improvements:
- Chipset sources - apply should exclude non-retail-models

UI Improvements:

Bug Fixes:

Migrating to App Router:
- API endpoint
  - Cannot do yet: https://github.com/chimurai/http-proxy-middleware/issues/932
- 404
  - Just need to migrate admin panel
- Admin panel

Home Page Improvements
- Show Top 5 Performance & Performance per dollar

Tech Debt:
- product form from builds branch
- better organization of code

Primary Focus:
- SEO
- List UI Improvements
- Game FPS
- More products

List UI Improvements:
- Add more verticality to page.
  - [] Stuff above the table?
  - [] Stuff below the table?

Scraping Improvements:

ADS:
- consider adjusting the side color for side auto ads
- how to show anchor ads on bottom in mobile?
- consider google cmp (last resort)

When Bored:
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

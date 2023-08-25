HIGH LEVEL TODO:
- replace deepmerge
  - two types of merges
    - applying updates (respecting auto-update)
    - created scraped object (respecting primary sources)
- fix market segment merging
  - maybe instead of merging, we pass in the current constructed object when scraping?
  - primary source -> a source the takes precedence if there is data
- data cleanup
  - fill in missing performance scores
  - fix up any misisng quarter release dates
  - consistent naming "(OEM)", "(Mobile)"
- Automation improvements
  - improve merging logic
    - write a custom deep merge, don't rely on deepmerge library
      - (custom merge is broken)
    - if field is undefined, then choose the non-undefined one
  - gpu retail models don't need to update as much. except for price?
  - double check indexes and looping sql queries
  - some slowdown when upserting sources
- Dependencies
  - Update framework dependencies
  - replace axios with fetch
- Security
  - setup weekly backups on digital ocean
  - Max file limit on sitemap path only
  - DDoS protection with Cloudflare
  - Rate limit non-staff api calls?
  - Add recaptcha?
  - database auto-backup
- human error protection
  - confirm on:
    - delete cpu
    - delete gpu
    - delete user
- performance
  - add caching
  - clean up ui components
  - reduce usages of index.ts for ui components
  - minimize time spent in a interactive transaction:
    - not everything needs a transaction
    - https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions
- Improve performance score (not just g3d mark or cpu mark)
- Affiliate Ads
  - live price checking for performance/price ranks, cache if it's been recent
    - can show a spinner when fetching the price
- More list filters
- DDoS / Scraping protection
- More benchmarks, fps averages (can have actual and estimated based on similar)
- Glossary
- Soft delete everything. Hard delete should be rare.
- seamless deployment
  - use docker to build on pc instead of server
  - use docker in general
- accessibility
- automation improvements
  - better handling of failures
    - improve uis
      - view failed, processing queue items
      - allow ability to requeue
    - allow us to requeue it


- auto-updates
  - gpu sources - chipsets and retail models
    - two separate tasks: one for chipsets, and one for retail models

CODE CLEANUP TASKS
- View Models
  - Single "model" or "viewModel" prop on each page props
    - Why? Improve consistency/simplicity of page props. Easy to find
      which data comes from view model. Errors can be in a separate "errors"
      property
- React components
  - Simplify components that loop through. Each loop element should be a component.
    - Why? Simplifies the parent component code signficantly, not having to juggle indexes
  - Improve consistency of where state, memo, callbacks, effects are placed in component code
    - Order: States, Memos, Callbacks, Effects
    - Why? Consistency across components
- Pagination
  - use new pagination; simpler.
    - add ability to treat each like a new page
- ListQuery
  - Move list cpus and gpus to use the generalized listquery ttype
- API Code
  - Improve consistency of service method parameters. For example, should we use
    *Request and *Response objects for parameters?
    - Why? Consistency makes it easier to define new code.
  - Improve consistency of parameters for GET calls? For example, a jsonified request object?
    - Why? Consistency makes it easier to define new code.
- Client Code
  - Improve tree shaking
    - Files should have a single concern.
  - Remove barrel files for client code, especially components
  - Remove all classes, replace with functions
    - Exceptions: API Client
    - Why? Improves tree shaking
  - Move common utilities to shared
    - Why? API, CLI needs to use some of them.
- Shared Code
  - Remove all classes
    - Why? Better for tree shaking. API can still use classes.
  - Move common utilities to shared
    - Why? Often used between packages.
  - Minimize third party dependencies
    - Why? Some packages are client-only or server-only
- Folder Structure
  - Use a consistent structure across client code
    - Why? 
- Validation
  - Move validation to controller
- List requests
  - handle getting count in same method as fetching results. Controller just
    routes request, service constructs reponse.

- cpu and gpu data
  - next source model cpu: 1175
    - npm run cli scrape-data:cpu -- -- --count 25 --offset 0
  - next source model gpu: 50
    - npm run cli scrape-data:gpu -- -- --count 25 --offset 0

- improve deployments
  - use docker, but not for database

Road Map:
- add content
  - new gpus
    - 7600 xt
  - retail models, chipsets
    - latest gpu id: 400
- clean up tech debt
  - listChipsets call - KISS
  - simplify components
  - general cleanup
  - max/min media queries
- improve view/compare relative performance/value
  - toggle market segments, default to same market segment
- cpus
  - view
  - compare
  - list
  - automation for importing/updating
- affiliate ads
- improve list page features
  - filter by year (multiselect combobox)
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


AUTOMATION IDEAS
- Add "Update" button that updates next thing in queue
- need to support new chipsets and retail models
- how to add to crawler queue
  - script that automatically adds to database?
  - add buttons that add to queue?
    - e.g. Edit GPU - "Add GPU / Retail Model to queue"
    - e.g. Edit GPU - "Add Retail Models"
- crawler queue database table?
  - type
    - e.g. GPU_CHIPSET, GPU_RETAIL_MODEL
  - metadata
    - i.e. extra data like parent chipset id
  - urls
    - i.e. multiple sets like techpowerup, videocardbenchmarks
    - e.g. https://www.techpowerup.com/gpu-specs/asus-rog-strix-rtx-3070-gaming.b8030  
  - status
    - e.g. PENDING, CANCELED, IN_PROGRESS, COMPLETED 


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


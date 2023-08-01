HIGH LEVEL TODO:
- Automation
  - add edit button after approving
  - reject pending updates when we edit cpu/gpu?
  - Mobile friendly so can approve anywhere
  - how to terminate without breaking?
- code cleanup
- Improve performance score (not just g3d mark or cpu mark)
- Affiliate Ads
- More list filters
- More benchmarks, fps averages (can have actual and estimated based on similar)
- Glossary
- Soft delete everything. Hard delete should be rare.
- auto-backup system

AUTOMATION TESTING:
- [] Terminate during action
- [] CLI
  - [x] verify only auto-updated fields get updated
  - [] Fetches New CPU Sources
  - [] Auto-archives CPU sources after fetching
  - [] Saving archives without action creation
  - [] Create CPU can archive, and creates action
  - [] Apply to CPU updates it on cpu, and creates action
  - [] Create CPU action fetches data and creates a product update
  - [x] Update CPU action fetches data and creates a product update
  - [] Approving update for new cpu creates cpu
  - [x] Approving update for updating cpu updates cpu
  - [x] rejecting doesnt apply
  - [] Gets backlog entry returns the next cpu to update
  - [x] Gets next entry gets next item in queue
  - [] Test automation queue

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

- auto-updates
  - TODO:
    - fix null company name for sourceName. don't do "company name".trim
      - get company from intel search on techpowerup
    - store failed state and errors in queue items
    - autocomplete source name with outbound link to site
    - approve data and edit
    - give option (default true) to hide sources after applying
  - how to avoid conflicts?
    - e.g. creating cpu manually when an equivalent new one are in the queue
      - Error out when executing (due to matching name)
 
  - database tables
  -  - Autopilot Priority Queue
    - Object
      - id
      - status: AutopilotQueueStatus
      - action: AutopilotAction
      - data: json
      - description: string
      - priority: number
      - status_updated_at: date
      - created_at: date
      - updated_at: date
    - enum AutopilotAction
      - UPDATE_SITEMAPS
      - FETCH_CPU_SOURCES
      - FETCH_GPU_SOURCES
      - CREATE_CPU
      - UPDATE_CPU
      - CREATE_GPU
      - UPDATE_GPU
    - enum AutopilotQueueStatus
      - PENDING
      - PROCESSED
      - DELETED
      - 
    - enum AutopilotEntryType
      - CPU_SOURCE
      - CPU_ENTITY
      - GPU_SOURCE
      - GPU_ENTITY
    - enum AutopilotEntryStatus
      - PENDING
      - APPROVED
      - REJECTED
    - autopilot_entries
      - id
      - status: AutopilotEntryStatus
      - type: AutopilotEntryType
      - action: AutopilotAction
      - data (json)
      - status_updated_at: date
      - created_at: date
      - updated_at: date
    - autopilot_logs
      - id
      - description: string
      - created_at: date
      - updated_at: date
    - product_sources
      - id
      - product_source: string
      - product_type: ProductType
      - product_name: string
      - product_url: string
      - archived: boolean
      - created_at: date
      - updated_at: date
      - Indexes:
        - product_type, product_name
        - product_type, product_url
    - product_update_approvals
  - sources
    - make it possible to add to existing cpu/gpu
      - confirm if overwrite
    - should reject only be temporary? what if we want to add it later?
    - reject should not be temporary. we should add a "show rejected" option.
      - can still query rejected one, reject just hides it from the list
  - queue
    - two parts: priority and regular
    - when source is confirmed, add it to priority part of queue
    - when requested on a cpu/gpu, add it to priority part of queue
    - on a regular schedule: fetch sources, fetch existing cpus/gpus
    - priority is always handled before regular
    - onlly priority queue is shown on website as regular queue is programmatic
  - updates
    - auto-update if frequently-updated field: current price, benchmarks
  - General:
    - Name: auto-pilot
    - shared service for calling website api
    - handle rate limiting, queue requests
  - [x] API key
    - [x] Database
    - [x] API key manager on admin panel
      - [x] Refresh API Key
    - [x] API Guard
      - tie api key to user
  - [] Overview Page
    - [x] Api Key widget on overview
      - create confirm dialog to prevent accidents
    - [] Widget that shows pending updates
    - [] Improve widget for scraper usage
  - [] Edit Form
    - [] "Update" button - scrapes, but only updates auto-update fields
  - [x] GPU Sources
    - [x] Improve fetching sources from passmark
  - [] New CPUs/GPUs
    - How to handle?
      - Page that lists out "Draft" cpus? Should these drafts be stored somewhere else?
  - [] Auto-Pilot script
    - [] CPUs
    - [] GPUs
      - [] Chipsets
      - [] Retail Models
  - [] ui to approve/combine sources
  - [] ui to approve updates
    - save and edit

- updating
  - call it auto-pilot
    - runs cron jobs of scrape-sources, scrape data
    - shared service for calling website api
      - queue scrape requests, detect rate limit
  - create api so cli can post data updates to the website
  - dashboard on overview that shows recent updates 
  - add another button to form - "Update"
    - Similar to Scrape, but only updates auto-update fields
  - show diff for scraping
  - store new cpu/gpu as draft?

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


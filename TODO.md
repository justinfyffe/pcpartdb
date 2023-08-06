HIGH LEVEL TODO:
- Automation
  - duplicate group names
    - just ignore it for now, 
    - show multiple on source card, so it's clear (done on cpu, need to do on gpu)
    - 
  - clean up name of columns/data structures
  - clean up names of indexes/uniques
  - group key to group sources together after saving?
    - can use the sanitize name function for this
  - add preferred slug with generate slug button. uses preferred name
  - add edit button after approving
  - Mobile friendly so can approve anywhere
  - how to terminate without breaking? also terminate remotely
  - validate that source urls are valid urls (includes domain) before creating sources
    - also validate any other things coming in
- code cleanup
- Improve performance score (not just g3d mark or cpu mark)
- Affiliate Ads
- More list filters
- More benchmarks, fps averages (can have actual and estimated based on similar)
- Glossary
- Soft delete everything. Hard delete should be rare.
- auto-backup system
- seamless deployment
  - use docker to build on pc instead of server
- accessibility


- auto-updates
  - gpu sources - chipsets and retail models
    - two separate tasks: one for chipsets, and one for retail models

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


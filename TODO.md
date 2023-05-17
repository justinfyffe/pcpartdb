Next tasks:
- clean up list gpus call
  - KISS
  - simplify, just use listChipsets and listRetailModels
  - clean up other code like this too
- create scratch pad cli script
- cpus
  - view
  - compare
  - list
  - automation for importing/updating
- improve automation
  - pull in new data
  - two core DO server
- seo
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
- improve list page features
  - filter by year (multiselect combobox)
- code cleanup
  - support max along with min for media queries
  - get rid of gpu and image cache?, or heavily improve it


OVERVIEW
- Use "chip" instead of "card" for mobile and integrated gpus


AUTOMATION IDEAS
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
  - 


CPUs
- Data sources:
  - pc part picker?
    - some extra data
    - e.g. https://pcpartpicker.com/product/g94BD3/amd-ryzen-5-5600x-37-ghz-6-core-processor-100-100000065box
  - techpowerup
    - most core data
    - e.g. https://www.techpowerup.com/cpu-specs/ryzen-9-7950x.c2846
    - https://www.techpowerup.com/cpu-specs/core-i7-13700k.c2850
  - cpu benchmark
    - performance
    - e.g. https://www.cpubenchmark.net/cpu.php?cpu=AMD+Ryzen+Threadripper+PRO+5975WX&id=4776
- Other Notes:
  - Benchmarks:
    - CPU Mark (Passmark)
    - GeekBench 6 - Single-core and multi-core
      - need to make sure we check that it's geekbench 6 and not other versions.
        If it's other versions, then we may need to update
      - https://browser.geekbench.com/processor-benchmarks/
  - CPUs could belong to multiple classes: e.g. server, desktop, and workstation
    - Should we default to desktop/workstation then? or support both



CODE CLEANUP IDEAS
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


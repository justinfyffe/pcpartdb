- cpu and gpu data
  - next source model cpu: 1175
    - npm run cli scrape-data:cpu -- -- --count 25 --offset 0
  - next source model gpu: 50
    - npm run cli scrape-data:gpu -- -- --count 25 --offset 0

- auto-updates
  - how to avoid conflicts?
    - e.g. creating cpu manually when an equivalent new one are in the queue
      - Error out when executing (due to matching name)
  - database tables
    - EntityType: CPU, GPU, NEWS
    - notes: should sources be structured? data should be json
    - autopilot_queue?
    - autopilot_sources?
    - autopilot_data?
  - sources
    - only add if we don't have the cpu/gpu for it already
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

GPU DATA
- Sources
  - notebookcheck
    - benchmarks

CPU DATA (!! = important spec ! = yes, ~ = mayber, X = no)
- Sources
  ! - TechPowerUp
      - Most specs
  ! - CPU Benchmark (Passmark)
      - CPU Mark
  ! - GeekBench
      - GeekBench benchmarks: https://browser.geekbench.com/processor-benchmarks
  ~ - Technical.City
      - List of CPUs
      - Other benchmarks?
  ~ - CPU-World
    - features / extensions / technologies
    - Integrated gpu data
    - https://www.cpu-world.com/CPUs/Zen/AMD-Ryzen%209%207900X.html
  - Nanoreview
    - Specs? Check if more consistent
    - https://nanoreview.net/en/cpu/intel-core-i7-13700
  - notebookcheck
    - benchmarks
- Physical
  !! - Socket :: AMD Socket AM4
  ! - Foundry :: TSMC
  ! - Process Size :: 7 nm
  ! - Transistors :: 3,800 million
  ! - Die Size: 74 mm^2
  X - I/O Process Size :: 12 nm
  X - I/O Die Size :: 124 mm^2
  ! - tCaseMax :: 95o C (a.k.a. Maximum case temperature (TCase), The max temperature for optimal performance/longetivity)
  ! - TjMax :: 100o C (a.k.a Maximum core temperature, temperature where CPU will start to throttle, reducing performance to cool down)
- Processor
  ! - Market :: Desktop
  ! - Production Status :: Active
  ! - Release Date :: Jul 7th, 2019
  ! - Launch Price :: $199
  ! - Part# :: 100-000000031
  ! - Bundled Cooler :: Wraith Stealth
- Core Config
  !! - # of Cores :: 6
  !! - # of Threads :: 12
  ! - Performance Cores :: 8 (a.ka. P-Cores)
  ! - Efficient Cores :: 8 (a.ka. E-Cores)
  X - Hybrid Cores :: P-Cores: 8, E-Cores: 16 (a.k.a. Performance Cores and Efficient Cores)
  X - SMP # CPUs :: 1 (a.k.a. SMP Cores - number of processors to share standard memory in a single os "symmetrical multi-processor cores")
  !! - Integrated Graphics :: N/A
- Performance
  !! - Frequency :: 3.6 GHz
  !! - Turbo Clock :: up to 4.2 GHz
  ! - Performance Core Clock (a.k.a. Frequency)
  ! - Performance Core Turbo Clock (a.k.a. P-Core Turbo / Turbo Clock)
  ! - Efficient Core Clock
  ! - Efficient Core Turbo Clock
  ! - Base Clock :: 100 MHz
  ! - Multiplier :: 36.0x
  !! - Multiplier Unlocked :: Yes (overclocking support)
  !! - TDP :: 65 W
  X - PPT :: 116 W (a.k.a. Package Power Tracking - Allowed socket power consumption permitted across the voltage rails supplying the socket)
  ! - PL1 :: 65 W (a.k.a. Marketed Power State (TDP))
  ! - PL2 :: 253 W (a.k.a TDP Up or "Power Limit" - The power draw when cpu boosts to turbo)
  X - PL2 Tau Limit :: Unlimited
  X - FP32 :: 1,209.6 GFLOPS
- Cache
  !! - Cache L1 :: 64K (per core)
  !! - Cache L2 :: 512K (per core)
  !! - Cache L3 :: 32MB (shared)
  X - E-Core L1 :: 96K (per core)
  X - E-Core L2 :: 4MB (per module)
- Architecture
  !! - Data Width :: 64 bit
  !! - Codename :: Matisse, Raptor Lake-S (a.k.a. Architecture codename)
  !! - Generation :: Ryzen 5; Core i9 (Raptor Lake)  (a.k.a. Series)
  !! - Memory Support :: DDR4 MHz Dual-channel
  !! - # of Memory Channels :: Dual Channel
  ! - Max Memory Size :: 128 Gb
  !! - Memory Speed :: 3200 MT/s (DDR4), 5600 MT/s (DDR5) (Megatransfers per second, data rate)
  ! - ECC Memory :: No
  ! - PCI-Express :: Gen 4, 15 Lanes (CPU Only)
  ! - Secondary PCIe :: Gen 4, 4 Lanes
  !! - Chipsets :: AMD 300 Series, AMD 400 Series, AMD 500 Series
! - Features
 - MMX
 - SSE
 - SSE2
 - SSe3
 - SSSE3
 - SSE4A
 - SSE4.1
 - SSE4.2
 - AES
 - AVX
 - AVX2
 - BMI1
 - BMI2
 - SHA
 - F16C
 - FMA3
 - AMD64
 - EVP
 - AMD-V
 - SMAP
 - SMEP
 - SMT
 - Precision Boost 2
 - RdRand
 - ABM
- Benchmarks
  ! - CPU Mark
  ! - GeekBench 6 Single Core
  ! - GeekBench 6 Multi Core


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


CPUs
- Determine CPU data structures
- Clean up code
  - Add GPU prefixes, or remove GPU prefix for appropriate code.
- Determine Data sources:
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
- Implement Pages
  - CPU Admin 
  - List CPUs Page
  - View CPU Page
  - Compare CPUs Page
- Update Existing Pages
  - Home Page
- Implement Search Functionality
  - Toggle Between GPU and CPU
- Overview Summary for View and Compare CPU
- Import Functionality
  - Automation
    - Scrape Data
    - Generate Import Data
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


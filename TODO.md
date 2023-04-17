Retail models
- gpus table or separate table for simplicity?
  - e.g. gpu_retail_boards
- gpu_retail_boards
  - store diff of gpu details? or store the full gpu details
    - diff is probably better
  - scrape from techpowerup
- should each retail board have their own url? and place in the sitemap?
- how to handle comparing?
- how to access? just a link on the page, or a dropdown to select from all retail models.

code cleanup
- cleanup shared
  - pure utilities
  - no dependencies that are browser or backend only

- cleanup utilities
  - more gpu field utils
    - are equal, compare, has value

Auto-update / pending update remaining work:
- Bug fix
  - don't create data update if websites fail to load.
  - add auto-update checkbox to name
  - order approved/rejected by most recent
- Code cleanup
  - Don't call individual scrape functions, pass data sources instead.
  - Don't include ScrapeGpuDetailsResponse in scraper.
    - Just use scrape results type.

Immediate Tasks:
    - symlink public folder to outside of packages
    - code cleanup:
      - use text instead of varchar
      - change "base" text value to 16px, not 18px.
      - make tailwind screen sizing min instead of max
        - seeing lg:text-xl implies large screens have text-xl
    - content: add rank for company performance. Figure out how to do db query
    - relative performance and relative value should be filtering based on market segment

  - folder structure for pages and components
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
  - Scraping improvements
    - Add download date when importing
    - Allow ability to overwrite existing gpus
  - Fix bug where unauthorized pages doesn't display
  - Improve security for reset password (add expiration to jwt)
  - code clean up
    - rename videocardbenchmarks to videocardbenchmark
    - improve usage of react components - break down into smaller
  

Post-launch:
- remove usage of router.push.
- set up auto backups
- add audit events table
  - track all changes to content
- improve import dialog
  - show all values
- List Page
  - filtered rank
  - infinite scroll
- View and Compare Page
  - Write summaries for each table/section
  - Add tooltips for each spec
  - look into using useController
- on-site SEO
  - Add alt tags
  - html semantics
  - sitemap
- improvements to part and image cache?
  - are they needed? could it be done better
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


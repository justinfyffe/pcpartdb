Code cleanup
- Don't call individual scrape functions, pass data sources instead.
- Don't include ScrapeGpuDetailsResponse in scraper.
  - Just use scrape results type.
- remove custom deep merge
- enabled should be false instead of removed when editing manually.
- improve mapping of field type to data source.
  - support multiple data sources
- improve structure of field
  - remove nested DataSource, flatten:
    - enabled -> autoUpdate
    - dataSources -> Array by order of precedence

Auto-update logic:
  - start with 2 GPUs / hour => 6 requests/hour => 4320 requests/month
    - 252 GPUs / 2 => 126 hours => fresh data every 5-6 days
  - Store queue in file, so we can pick up where we left off
  - build queue when queue is empty
  - order by release date, no release dates should be first
  - Must do pending updates, see below
  - only allow auto-updates for fields that are enabled for 3rd party data.
  - should saving gpus invalidate data updates?
    - probably

- add general scrapeGpuData to scraper.
  - deep merge the results from all sources
  - create data type for scrape results; separate from scrape response in shared
  - don't expose the individual scraping methods

Data Updates:
  - All automated data changes require pending updates checks, except for the following:
    - benchmarks
    - note: release date and launch price should still be approved since they don't change often
      - when we add current price, that will be auto-approved
  - store in db table of update with a diff of the existing and new data objects
  - show in admin panel all pending updates
    - Add dialog to show diff
    - make it easy to approve/reject
  - an entity can only have one pending update at a time, to avoid conflicts
    - if a pending update already exists,
  - can also show auto-approved updates
  - import tool could show pending updates, but doesn't need to add to pending updates table
  - DB Table:
    - data_updates
      - id: number
      - gpu_id: number (nullable so we can support other future types)
      - decision_user_id: number (null => automatic)
      - description: string
      - diff: json
      - status: REJECTED, PENDING, APPROVED
      - update_source: MANUAL, AUTO_UPDATER, GPU_IMPORTER
      - date_decision: Date
      - date_created: Date
      - date_updated: Date
  - DataUpdateEntity, DataUpdate
  - TBD: how to make sure we're not constantly rejecting the same changes
    - Note: Rejecting is probably a sign that we need to improve our importers
    - Maybe don't worry about it until it becomes a problem?
  - TBD: should manually updating a gpu go through this too?

Immediate Tasks:
    - symlink public folder to outside of packages
    - store data outside of packages for auto-updater and cli
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


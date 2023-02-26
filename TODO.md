~: Maybe done, but need to test
X: Done and tested

Immediate Tasks:
  - Scraping improvements - data sources
    - [X] add mappers to handle data source in database
    - [X] Exclude data source details for non-staff users (or exclude outside admin panel)
    - [X] Add UI for specifying sources for the gpu
    - [X] Add non-intrusive UI to override data source on individual field
    - [] Update existing gpus to use new metadata structure
      - [X] local
      - [] prod - run pcpartdb.com/api/gpus/fix
    - [] Remove legacy metadata mappers after updating
    - [] Add download date when importing
  - Fix bug where unauthorized pages doesn't display
  - Improve security for reset password (store hashed tokens in db)
  - Don't upload node_modules when deploying, just use npx
  - Data refactor
    - home page - update comparison texts based on tag
  - Test everything
  

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


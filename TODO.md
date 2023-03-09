~: Maybe done, but need to test
X: Done and tested

Workspaces:
- scraper
- database (prisma, migrations)
- website

Immediate Tasks:
  - Deployment bug
    - For some reason, port for dev api is being included
      - Need to replace 3001 with 3011 in the .next/routes-manifest file
      - check if production when building
  - improve autocomplete sorting
    - show more recent gpus
  - Make separate project for tools? Or setup lerna? or setup npm workspace? Or not bother
    - Can exclude out of deployment
    - Can include heavier dependencies
    - CLI Tools that will be useful to run to improve workflows
    - Tools
      - Scraper: Fetches URLs and creates data structure
  - Scraping Tool
    - Download pages:
      - techpowerup https://www.techpowerup.com/gpu-specs/?ajaxsrch=g&_=1677459591243
      - ul benchmarks: https://benchmarks.ul.com/compare/best-gpus?amount=0&reverseOrder=true&search=v
      - videocardbenchmark https://www.videocardbenchmark.net/GPU_mega_page.html
        - Needs puppeteer (how to avoid including in deployment) - maybe install globally?
    - Create tool that builds data set from downloaded pages
  - Scraping improvements - data sources
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


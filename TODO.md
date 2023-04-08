~: Maybe done, but need to test
X: Done and tested

Immediate Tasks:
    - code cleanup:
      - create crawler class.
        - Consider using a class base structure?
      - change "base" text value to 16px, not 18px.
      - make tailwind screen sizing min instead of max
        - seeing lg:text-xl implies large screens have text-xl
    - content: add rank for company performance. Figure out how to do db query
    - relative performance and relative value should be filtering based on market segment

  - use branches for each version, merge to master afterwards
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


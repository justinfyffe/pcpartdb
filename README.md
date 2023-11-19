# PC Parts DB

## Requirements

Node v20
global install of PM2 on server
At least 2 vCPUs and 2GB RAM

# Services Used
- Digital Ocean - hosting
- ScrapingAnt - Web Scraper
- Cloudflare - DDoS Protection

# Production Info
- Create swap file (4gb)
- set swappiness = 10
- set vfs cache pressure = 50
- followed https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-22-04
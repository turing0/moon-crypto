/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://mooncryp.to',
  generateRobotsTxt: false, // (optional)
  changefreq: 'weekly',
  // ...other options
}
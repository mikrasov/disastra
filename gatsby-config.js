const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://waynoc.netlify.app',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

const activeEnv =  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"



module.exports = {
  siteMetadata: {
    title: 'Malastra',
    twitterUser: '@mikrasov',
    authors: "Michael Nekrasov",
    description: 'A space opera role playing browser game.',
    keywords: 'RPG, Game, Online Game, Free, Space, Story, Browser Game',
    featuredImageURL:'',
    googleAppName: '',
    googleAppId: '',
    googleAppURL: '',
    siteUrl,
    activeEnv
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-react-svg`,
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Malastra',
        short_name: 'Malastra',
        start_url: '/',
        background_color: '#0277bd',
        theme_color: '#0277bd',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [],
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null
          }
        }
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {},
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `events`,
        path: `${__dirname}/story/events`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `stats`,
        path: `${__dirname}/story/stats`,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-markdown-storybook`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    'gatsby-plugin-catch-links',
    `gatsby-plugin-netlify`, //KEEP LAST!
  ],
}

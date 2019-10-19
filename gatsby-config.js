module.exports = {
  plugins: [
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Bondify`,
        short_name: `Bondify`,
        start_url: `/`,
        background_color: `#fafafa`,
        theme_color: `#222`,
        display: `standalone`,
        icon: `src/images/icon.png`
      }
    }
  ]
};

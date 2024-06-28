const fs = require("fs");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

const hostname = "http://media-hub.ru";

const routes = [
  "/",
  "/about",
  "/login",
  "/person/:id",
  "/partner",
  "/categories/:id",
  "/region/:id",
  "*",
];

async function generateSitemap() {
  const sitemapStream = new SitemapStream({ hostname });
  const pipeline = sitemapStream.pipe(createGzip());

  routes.forEach((route) => {
    sitemapStream.write({ url: route, changefreq: "weekly", priority: 0.8 });
  });

  sitemapStream.end();

  const sitemap = await streamToPromise(pipeline);
  fs.writeFileSync("./public/sitemap.xml.gz", sitemap);
}

generateSitemap()
  .then(() => {
    console.log("Sitemap generated successfully.");
  })
  .catch((error) => {
    console.error("Error generating sitemap:", error);
  });

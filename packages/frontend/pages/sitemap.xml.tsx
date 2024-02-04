import fs from "fs";
import data from "../data/main";
import createPages from "../data/createPages";

function generateSiteMap(staticPages: any) {
  const links = data["categories"][0].sections.map((item: any) => {
    return item.value;
  });

  // <lastmod>${new Date().toISOString()}</lastmod>
  // <changefreq>monthly</changefreq>
  // <priority>0.9</priority>

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
    http://www.w3.org/1999/xhtml
    http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd">
    
    <url>
      <loc>https://www.ellty.com</loc>
      ${data.langList
        .map((item) => {
          if (item.abbr === "en")
            return `
        <xhtml:link 
                rel="alternate"
                hreflang="${item.abbr}"
                href="https://www.ellty.com"/>
        `;

          return `
        <xhtml:link 
                rel="alternate"
                hreflang="${item.abbr}"
                href="https://www.ellty.com/${item.abbr}"/>
        `;
        })
        .join("")}
    </url>
    
    ${staticPages
      .map((url: any) => {
        const urlSplit = url.split("https://www.ellty.com/");
        return `
          <url>
            <loc>${url}</loc>
            ${data.langList
              .map((item) => {
                if (item.abbr === "en")
                  return `
              <xhtml:link 
                      rel="alternate"
                      hreflang="${item.abbr}"
                      href="https://www.ellty.com/${urlSplit[1]}"/>
              `;

                return `
              <xhtml:link 
                      rel="alternate"
                      hreflang="${item.abbr}"
                      href="https://www.ellty.com/${item.abbr}/${urlSplit[1]}"/>
              `;
              })
              .join("")}
          </url>
        `;
      })
      .join("")}
  
    ${data["categories"][0].sections
      .map((item: any) => {
        const routeTitle = item.value;
        return `
      <url>
        <loc>https://www.ellty.com/templates${routeTitle}</loc>
        ${data.langList
          .map((item) => {
            if (item.abbr === "en")
              return `
          <xhtml:link 
                  rel="alternate"
                  hreflang="${item.abbr}"
                  href="https://www.ellty.com/templates${routeTitle}"/>
          `;

            return `
          <xhtml:link 
                  rel="alternate"
                  hreflang="${item.abbr}"
                  href="https://www.ellty.com/${item.abbr}/templates${routeTitle}"/>
          `;
          })
          .join("")}
      </url>
    `;
      })
      .join("")}

    ${createPages.createCategoryPages
      .map((item) => {
        const routeTitle = item.value;
        return `
        <url>
          <loc>https://www.ellty.com/create/${routeTitle}</loc>
          ${data.langList
            .map((item) => {
              if (item.abbr === "en")
                return `
            <xhtml:link 
                    rel="alternate"
                    hreflang="${item.abbr}"
                    href="https://www.ellty.com/create/${routeTitle}"/>
            `;

              return `
            <xhtml:link 
                    rel="alternate"
                    hreflang="${item.abbr}"
                    href="https://www.ellty.com/${item.abbr}/create/${routeTitle}"/>
            `;
            })
            .join("")}
        </url>
      `;
      })
      .join("")}
    
    </urlset>
    `;
}

// ${createPages.createTagPages.map(item => {
//   const routeTitle = `${item.parent}/${item.value}`
//   return `
//     <url>
//       <loc>https://www.ellty.com/create/${routeTitle}</loc>
//       ${data.langList.map(item => {
//         if(item.abbr === 'en') return `
//         <xhtml:link
//                 rel="alternate"
//                 hreflang="${item.abbr}"
//                 href="https://www.ellty.com/create/${routeTitle}"/>
//         `

//         return `
//         <xhtml:link
//                 rel="alternate"
//                 hreflang="${item.abbr}"
//                 href="https://www.ellty.com/${item.abbr}/create/${routeTitle}"/>
//         `
//       }).join("")}
//     </url>
//   `;
// }).join("")}
// <url>
//   <loc>https://www.ellty.com/create/facebook-covers</loc>
//   ${data.langList.map(item => {
//     if(item.abbr === 'en') return `
//     <xhtml:link
//             rel="alternate"
//             hreflang="${item.abbr}"
//             href="https://www.ellty.com/create/facebook-covers"/>
//     `

//     return `
//     <xhtml:link
//             rel="alternate"
//             hreflang="${item.abbr}"
//             href="https://www.ellty.com/${item.abbr}/create/facebook-covers"/>
//     `
//   }).join("")}
// </url>

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

//@ts-ignore
export async function getServerSideProps({ res }) {
  const baseUrl = {
    development: "http://localhost:3333",
    production: "https://www.ellty.com",
    test: "http://localhost:3333",
  }[process.env.NODE_ENV];

  // We generate the XML sitemap with the posts data

  const staticPages = fs
    .readdirSync("pages")
    .filter((staticPage) => {
      return ![
        "_app.tsx",
        "_document.tsx",
        "_error.tsx",
        "sitemap.xml.tsx",
        "404.tsx",
        "test.tsx",
        "paypal-pay",
        "admin",
        "index.tsx",
        "settings",
        "designs",
        "folders",
        "liked",
        "trash",
        "design",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${baseUrl}/${staticPagePath}`;
    });

  const sitemap = generateSiteMap(staticPages);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;

import dotenv from "dotenv";
import { getJson } from "serpapi";
import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import fetch from "node-fetch";

dotenv.config();

// List of keywords to search for
const keywords = ["coffee", "playstation 5", "web scraping"];

/**
 * Fetches search results from Google using SerpAPI
 * @param {string} query - Search query term
 * @returns {Promise<Object>} Search results object
 */
const fetchSearchResults = async (query) => {
  return await getJson("google", {
    api_key: process.env.SERPAPI_KEY,
    q: query,
    num: 5,
  });
};

/**
 * Parses a URL and converts its content to markdown
 * @param {string} url - The URL to parse
 * @returns {Promise<Object>} Object containing title and content in markdown
 */
const parseUrl = async (url) => {
  try {
    // Configure fetch request with browser-like headers
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Initialize HTML parser and markdown converter
    const $ = cheerio.load(html);
    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });

    // Clean up HTML by removing unnecessary elements
    $("script, style, nav, footer, iframe, .ads").remove();

    // Extract title and main content
    const title = $("title").text().trim() || $("h1").first().text().trim();
    const mainContent =
      $("article, main, .content, #content, .post").first().html() ||
      $("body").html();
    const content = turndown.turndown(mainContent || "");

    return { title, content };
  } catch (error) {
    console.error(`Failed to parse ${url}:`, error.message);
    return null;
  }
};

/**
 * Sanitizes a keyword for use in filenames
 * @param {string} keyword - The keyword to sanitize
 * @returns {string} Sanitized keyword
 */
const sanitizeKeyword = (keyword) => {
  return keyword
    .replace(/\s+/g, "_") // Replace spaces with hyphens
    .substring(0, 15) // Truncate to 10 characters
    .toLowerCase(); // Convert to lowercase
};

/**
 * Writes parsed content to a markdown file
 * @param {Object} data - The data to write
 * @param {string} keyword - The search keyword
 * @param {number} index - Result index
 * @param {string} url - The URL of the source
 * @returns {Promise<string>} The filename where content was written
 */
const writeToMarkdown = async (data, keyword, index, url) => {
  const sanitizedKeyword = sanitizeKeyword(keyword);
  const filename = path.join(
    "output",
    `${new Date().toISOString()}_${sanitizedKeyword}_${index + 1}.md`
  );
  const content = `[//]: # (Source: ${url})\n\n# ${data.title}\n\n${data.content}`;
  await fs.writeFile(filename, content, "utf-8");
  return filename;
};

// Main execution block
(async () => {
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir("output", { recursive: true });

    // Process each keyword
    for (const keyword of keywords) {
      const results = await fetchSearchResults(keyword);

      // Process search results if available
      if (results.organic_results && results.organic_results.length > 0) {
        for (const [index, result] of results.organic_results.entries()) {
          try {
            const data = await parseUrl(result.link);
            const filename = await writeToMarkdown(
              data,
              keyword,
              index,
              result.link
            );
            console.log(`Written to: ${filename}`);
          } catch (err) {
            console.error(`Failed to process ${result.link}:`, err.message);
            continue;
          }
        }
      } else {
        console.log(`No organic results found for keyword: ${keyword}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

# Search Results To Markdown

Fetch search results from Google using SerpAPI, parses the content of the resulting URLs, and converts the content to markdown files. The application uses various libraries such as dotenv, cheerio, turndown, and node-fetch to achieve this functionality.

## Features

- Fetches search results from Google using SerpAPI.
- Parses the content of URLs and converts it to markdown.
- Saves the parsed content as markdown files in the output directory.

## Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)
- SerpAPI key

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/reader-blog.git
   cd reader-blog
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file by copying the `.env.example` file and filling in your SerpAPI key:

   ```sh
   cp .env.example .env
   ```

   Edit the [.env](./.env) file and add your SerpAPI key:

   ```env
   SERPAPI_KEY=your_serpapi_key
   ```

   Your SerpApi key can be obtained by signing up at [SerpAPI](https://serpapi.com/) and navigating to [Api Key](https://serpapi.com/manage-api-key) page from your account dashboard.

## Usage

To start the application, run:

```sh
npm start
```

The application will fetch search results for the predefined keywords, parse the content of the resulting URLs, and save the content as markdown files in the output directory.

## Project Structure

- [index.js](./index.js): Main application file.
- [output](./output/): Directory where the markdown files are saved.
- [.env.example](./.env.example): Example environment variables file.

## Dependencies

- [SerpAPI](https://serpapi.com/integrations/javascript) for providing the search API.
- [Cheerio](https://github.com/cheeriojs/cheerio) for HTML parsing.
- [Turndown](https://github.com/mixmark-io/turndown) for converting HTML to markdown.

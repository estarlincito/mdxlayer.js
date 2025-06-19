# `mdxlayer`

Transform your `.mdx` content into strongly typed, structured JSON and TypeScript declarations with minimal config. Built for performance, flexibility, and DX.

## 🚀 Features

- 🧠 Validates frontmatter with [Tyne](https://tyne.estarlincito.com/)
- ⚡ Generates structured `.json` and `.d.ts` from `.mdx` content
- 🛠 Add computed fields with `resolvedFields`
- 📁 Language-based content grouping (`en`, `es`, `all`)
- 🔄 Watch mode for development
- ✅ Type-safe at every level
- 📦 Simple CLI: `mdxlayer build` & `mdxlayer dev`

## 📦 Installation

```bash
pnpm add -D mdxlayer
# or
npm install -D mdxlayer
# or
yarn add -D mdxlayer
```

## ⚙️ Configuration

Create a `mdxlayer.config.mts` file:

```ts
import { defineConfig } from 'mdxlayer';
import { t } from 'tyne';

const ArticleSchema = t.object({
  title: t.string(),
  category: t.string(),
  subcategory: t.string(),
  publishedTime: t.string(),
  modifiedTime: t.string(),
  description: t.string(),
  authors: t.array(t.string()),
  avatar: t.string(),
  cover: t.string(),
  coverAlt: t.string(),
  check: t.boolean(),
  lang: t.string(),
  tags: t.array(t.string()),
});

export default defineConfig({
  name: 'Articles',
  contentDir: 'content',
  frontmatterSchema: ArticleSchema,
  resolvedFields: {
    title_: { resolve: (doc) => doc.title, type: t.string() },
    slug: {
      resolve: (doc) => doc.file.replace(/\.mdx$/, ''),
      type: t.string(),
    },
  },
});
```

## 🧠 TypeScript Setup

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "mdxlayer/generated": ["./.mdxlayer/generated"]
    }
  },
  "include": ["./.mdxlayer/generated"]
}
```

## 📄 Example `.mdx` File

```mdx
---
title: 'What Makes MDX Powerful'
category: 'tech'
subcategory: 'markdown'
publishedTime: '01-04-2025'
modifiedTime: '01-04-2025'
description: 'A deep dive into what makes MDX a game-changer for modern content.'
authors: ['Estarlincito']
avatar: '/assets/avatar.jpeg'
cover: '/covers/mdx.png'
coverAlt: 'MDX visual cover'
check: true
lang: 'en'
tags: ['mdx', 'content', 'markdown']
---

Hello!

<Introduction>

> Lorem ipsum dolor sit amet, consectetur adipiscing elit.

</Introduction>

<Audio src='/audio/intro.mp3' type='audio/mp3' />

> _"MDX is where content meets interactivity."_  
> **– Anonymous**
```

## ✨ Usage in Code

```ts
import { EsArticles, EnArticles, AllArticles } from 'mdxlayer/generated';

console.log(EsArticles[0].title);
```

## 🖥 CLI Commands

```bash
pnpm mdxlayer build
# Generate static JSON and index.d.ts

pnpm mdxlayer dev
# Watch mode — regenerate on file changes
```

## 📁 Output Structure

```
.mdxlayer/
├── generated/
│   ├── Articles/
│   │   ├── en.json
│   │   ├── es.json
│   │   └── all.json
│   ├── index.d.ts
│   └── index.js
```

## Plugins

## `next-mdxlayer`

## 📦 Installation

```bash
pnpm add -D next-mdxlayer
# or
npm install -D next-mdxlayer
# or
yarn add -D next-mdxlayer
```

## ⚙️ Configuration

```ts
import { withMdxlayer } from 'next-mdxlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'ts', 'jsx', 'tsx', 'mdx'],
  experimental: {
    serverActions: true,
  },
};

export default withMdxlayer(nextConfig);
```

## 🔩 API

### `defineConfig(config)`

Accepts the following shape:

```ts
interface Config {
  name: string;
  contentDir: string;
  frontmatterSchema: TyneType;
  resolvedFields?: Record<
    string,
    { resolve: (doc: Doc) => any | Promise<any> }
  >;
}
```

### `Doc`

```ts
interface Doc {
  _filePath: string;
  _id: string;
  _body: { raw: string };
  // + fields from your frontmatterSchema
}
```

## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))

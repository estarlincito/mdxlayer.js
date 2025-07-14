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

## 📑 Requirements

- Node.js 18+ (ESM only)
- `mdxlayer` installed globally or locally
- MDX files must follow this rule: **no spaces in filenames**
  ✅ `about.mdx`
  ❌ `about me.mdx`

## 📦 Installation

```bash
pnpm add -D mdxlayer
# or
npm install -D mdxlayer
# or
yarn add -D mdxlayer
```

## ⚙️ Configuration

Create a `mdxlayer.config.ts` file:

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
  docType: 'Articles',
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
import { esArticles, enArticles, allArticles } from 'mdxlayer/generated';

console.log(esArticles);
console.log(enArticles);
console.log(allArticles);
```

## 🖥 CLI Commands

```bash
pnpm mdxlayer build
# Generate static JSON and index.d.ts

pnpm mdxlayer dev
# Watch mode — regenerate on file changes

pnpm mdxlayer build --config docs.config.js
# This will load settings from `docs.config.js`

mdxlayer build --config docs.config.js --out docs-content
# This will load `docs.config.js` and output to `docs-content/`
```

## 📁 Folder Structure

```
content/
├── what-makes-mdx-powerful.mdx
```

## 📁 Output Structure

```
.mdxlayer/
├── cache/
│   ├── compiled-config.js
│   ├── data.json
├── generated/
│   ├── Articles/
│   │   ├── what-makes-mdx-powerful.json
│   ├── types.d.ts
│   ├── index.d.ts
│   └── index.js
├── package.json
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

```ts
 import { useMDXComponent } from 'next-mdxlayer/hook';
 import { allServices } from 'mdxlayer/generated';
 import MyAudioComponent from './audio'
 import MyIntroComponent from './intro'


 export default function MyPage() {
   const MDXComponent = useMDXComponent(allServices[0]._body.code);
   return (
     <MDXComponent
       components={{
         a: (props) => <a {...props} className="underline text-blue-600" />,
         img: (props) => <img {...props} style={{ maxWidth: '100%' }} />,
         Audio: MyAudioComponent,
         Introduction: MyIntroComponent,
       }}
     />
   );
 }
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
  _body: { raw: string; code: string };
  // + fields from your frontmatterSchema
}
```

## 📝 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

**Author:** Estarlin R ([estarlincito.com](https://estarlincito.com))

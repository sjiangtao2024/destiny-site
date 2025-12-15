import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import fm from 'front-matter';
import { marked } from 'marked';
import prettier from 'prettier';

// 配置路径
const CONTENT_DIR = 'content/articles';
const TEMPLATE_DIR = 'src/templates';
const OUTPUT_DIR = 'public/articles';
const HOMEPAGE_TEMPLATE = path.join(TEMPLATE_DIR, 'index.html');
const ARTICLE_TEMPLATE = path.join(TEMPLATE_DIR, 'article.html');
const HOMEPAGE_OUTPUT = 'index.html';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function build() {
  console.log('🏗️  开始构建网站...');

  // 1. 读取所有 Markdown 文件
  // Use forward slashes for glob pattern to ensure cross-platform compatibility
  const files = await glob(`${CONTENT_DIR}/*.md`.replace(/\\/g, '/'));
  const articles = [];

  // 读取模板
  const articleTemplate = fs.readFileSync(ARTICLE_TEMPLATE, 'utf-8');
  const homepageTemplate = fs.readFileSync(HOMEPAGE_TEMPLATE, 'utf-8');

  console.log(`找到 ${files.length} 篇 Markdown 文章。`);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const { attributes, body } = fm(content);
    
    // 解析文件名获取 slug 和日期
    // 文件名格式: YYYY-MM-DD-slug.md
    const filename = path.basename(file, '.md');
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    
    let date = attributes.date;
    let slug = filename;
    
    if (match) {
      // 保持和现有 URL 兼容: 2025-09-23-first-principles.md -> article-first-principles.html
      slug = `article-${match[2]}`;
      // 如果 frontmatter 没写日期，也可以用文件名里的日期
      if (!date) date = match[1];
    } else {
        // 如果文件名不符合格式，直接用文件名作为 slug
        slug = filename;
    }
    
    // 确保日期是字符串格式 YYYY-MM-DD
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;

    const htmlContent = marked(body);
    
    // 存储文章数据
    articles.push({
      ...attributes,
      slug,
      date: dateStr,
      content: htmlContent,
    });
  }

  // 按日期倒序排序文章
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 2. 生成文章页 (包含相关文章逻辑)
  for (const article of articles) {
     // 简单的相关文章：取最新的 3 篇（排除自己）
     // 优化逻辑：实际场景可能需要随机或者同分类，这里暂时用最新
     const related = articles
        .filter(a => a.slug !== article.slug)
        .slice(0, 3)
        .map(a => `<li><a href="/articles/${a.slug}.html">${a.title}</a></li>`)
        .join('\n');

     let pageHtml = articleTemplate
      .replace(/{{title}}/g, article.title)
      .replace(/{{date}}/g, article.date)
      .replace(/{{category}}/g, article.category)
      .replace(/{{description}}/g, article.description)
      .replace(/{{cover_image}}/g, article.cover_image)
      .replace(/{{content}}/g, article.content)
      .replace(/{{related_links}}/g, related);
      
      try {
        pageHtml = await prettier.format(pageHtml, { parser: 'html' });
      } catch (err) {
        console.warn(`Prettier formatting failed for ${article.slug}, using raw HTML.`);
      }
      
      // 添加自动生成注释
      pageHtml = `<!-- ⚠️ 此文件由脚本自动生成，请勿直接修改。请编辑 content/articles/ 下对应的 Markdown 文件。 -->\n` + pageHtml;

      const outputPath = path.join(OUTPUT_DIR, `${article.slug}.html`);
      fs.writeFileSync(outputPath, pageHtml);
      console.log(`✅ 生成文章: ${article.slug}.html`);
  }

  // 3. 生成首页文章列表
  const articlesListHtml = articles.map(article => `
    <article class="article-card">
      <img
        src="${article.cover_image}"
        alt="${article.title} 插画"
        class="article-cover"
        loading="lazy"
      />
      <div class="article-head">
        <h3>${article.title}</h3>
        <p class="meta">${article.date} · ${article.category}</p>
      </div>
      <div class="article-body">
        <p>
          ${article.description}
        </p>
        <a class="read-more" href="/articles/${article.slug}.html">
          阅读全文 <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  `).join('\n');

  // 写入首页
  let homepageHtml = homepageTemplate.replace('{{article_list}}', articlesListHtml);
  try {
    homepageHtml = await prettier.format(homepageHtml, { parser: 'html' });
  } catch (err) {
      console.warn('Prettier formatting failed for homepage, using raw HTML.');
  }
  
  // 添加自动生成注释
  homepageHtml = `<!-- ⚠️ 此文件由脚本自动生成，请勿直接修改。请编辑 src/templates/index.html 或 content/articles/ 下的 Markdown 文件。 -->\n` + homepageHtml;

  fs.writeFileSync(HOMEPAGE_OUTPUT, homepageHtml);
  console.log('✅ 生成首页: index.html');
  
  console.log('🎉 构建完成！');
}

build().catch(console.error);

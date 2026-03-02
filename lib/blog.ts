import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Define the structure of blog post metadata
export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    author: string;
    keywords: string;
    category: string;
    readingTime: string;
    published: boolean;
    content: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

/**
 * Get all blog post slugs from the content/blog directory
 */
export function getAllPostSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => fileName.replace(/\.md$/, ''));
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse frontmatter (expects YAML format with --- delimiters)
        const { data, content } = matter(fileContents);

        // Convert Markdown to HTML
        const processedContent = await remark().use(html).process(content);
        const contentHtml = processedContent.toString();

        return {
            slug,
            title: data.title || 'Sin título',
            excerpt: data.excerpt || '',
            coverImage: data.coverImage || '/images/placeholder-product.jpg',
            date: data.date || new Date().toISOString().split('T')[0],
            author: data.author || 'Lukess Home',
            keywords: data.keywords || '',
            category: data.category || 'General',
            readingTime: data.readingTime || '5 min',
            published: data.published !== false, // Default to true
            content: contentHtml,
        };
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

/**
 * Get all published blog posts, sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
    const slugs = getAllPostSlugs();
    const posts = await Promise.all(
        slugs.map((slug) => getPostBySlug(slug))
    );

    // Filter out null values and unpublished posts
    const validPosts = posts.filter(
        (post): post is BlogPost => post !== null && post.published
    );

    // Sort by date (newest first)
    return validPosts.sort((a, b) => {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
    });
}

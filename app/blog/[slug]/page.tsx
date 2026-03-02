import { getPostBySlug, getAllPostSlugs } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts (SSG)
export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Artículo no encontrado',
        };
    }

    return {
        title: `${post.title} | Lukess Home`,
        description: post.excerpt,
        keywords: post.keywords,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://lukesshome.com/blog/${slug}`,
            type: 'article',
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            publishedTime: post.date,
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // JSON-LD structured data for BlogPosting
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.date,
        author: {
            '@type': 'Organization',
            name: post.author,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Lukess Home',
            logo: {
                '@type': 'ImageObject',
                url: 'https://lukesshome.com/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://lukesshome.com/blog/${slug}`,
        },
        keywords: post.keywords,
    };

    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back to Blog Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-gray-900 hover:text-black mb-8 font-semibold"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Volver al Blog
                </Link>

                {/* Header */}
                <header className="mb-8">
                    {/* Category & Reading Time */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {post.category}
                        </span>
                        <span>- </span>
                        <span>{post.readingTime}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-gray-500">
                        <span>{post.author}</span>
                        <span>- </span>
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('es-BO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="relative w-full h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg prose-zinc max-w-none
            prose-headings:font-bold prose-headings:text-zinc-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-900 prose-strong:font-semibold
            prose-ul:my-6 prose-li:my-2
            prose-img:rounded-lg prose-img:shadow-md"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA Section */}
                <div className="mt-16 p-8 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg text-center">
                    <h3 className="text-2xl font-bold mb-4">
                        ¿Te gustó este artículo?
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                        Explorá nuestro catálogo completo de ropa masculina premium en
                        Santa Cruz. Camisas Columbia, Nautica, blazers, pantalones y más.
                    </p>
                    <Link
                        href="/catalogo"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-sm rounded-md hover:bg-black transition-colors"
                    >
                        Ver Catálogo
                    </Link>
                </div>
            </article>
        </>
    );
}

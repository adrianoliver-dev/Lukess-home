import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog de Moda Masculina | Lukess Home Santa Cruz',
    description:
        'Guías de estilo, outfits y consejos de moda para hombres en Santa Cruz. Cómo combinar camisas Columbia, Nautica y más marcas premium.',
    keywords:
        'blog moda hombre Bolivia, outfits hombre Santa Cruz, guía estilo masculino',
    openGraph: {
        title: 'Blog de Moda Masculina | Lukess Home',
        description: 'Guías de estilo y outfits para hombres en Santa Cruz',
        url: 'https://lukesshome.com/blog',
        type: 'website',
    },
};

export default async function BlogIndexPage() {
    const posts = await getAllPosts();

    if (posts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Blog</h1>
                <p className="text-gray-500">
                    Próximamente: guías de estilo, outfits y consejos de moda masculina.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Blog de Moda Masculina
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Guías de estilo, outfits y consejos para vestir bien en Santa Cruz.
                    Cómo combinar camisas Columbia, pantalones, blazers y más.
                </p>
            </header>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <article
                        key={post.slug}
                        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                    >
                        <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                            {/* Cover Image */}
                            <div className="relative h-48 bg-gray-50">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Category & Reading Time */}
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                                    <span className="font-medium text-gray-700">
                                        {post.category}
                                    </span>
                                    <span>- </span>
                                    <span>{post.readingTime}</span>
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-black transition-colors">
                                    {post.title}
                                </h2>

                                {/* Excerpt */}
                                <p className="text-gray-500 mb-4 line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>

                                {/* Date */}
                                <time className="text-sm text-gray-500 mt-auto" dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString('es-BO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}

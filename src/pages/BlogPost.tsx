import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '@/data/blogPosts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import NotFound from './NotFound';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <SEOHead
        config={{
          title: `${post.title} | The Standard Playbook Blog`,
          description: post.description,
          keywords: post.keywords,
          type: 'article',
          ogImage: post.ogImage,
        }}
      />
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">
        <Link to="/blog" className="text-primary hover:text-primary/80 text-sm mb-6 inline-block">
          &larr; Back to Blog
        </Link>
        <article>
          <time className="text-sm text-gray-500">{post.date}</time>
          <h1 className="font-oswald font-bold text-3xl md:text-5xl uppercase tracking-tight text-white mt-2 mb-8">
            {post.title}
          </h1>
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="font-oswald font-bold text-2xl mt-10 mb-4 text-white">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter(Boolean);
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-gray-300">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                );
              }
              if (paragraph.includes('[') && paragraph.includes('](')) {
                const html = paragraph
                  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80">$1</a>');
                return <p key={i} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return (
                <p key={i} className="text-gray-300 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

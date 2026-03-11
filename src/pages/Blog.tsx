import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Blog = () => {
  return (
    <div className="min-h-screen bg-dark text-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-gray-400 text-lg mb-12">
          Insights and strategies for insurance agency owners.
        </p>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="border border-white/10 rounded-lg p-6 hover:border-primary/40 transition-colors">
              <Link to={`/blog/${post.slug}`}>
                <time className="text-sm text-gray-500">{post.date}</time>
                <h2 className="font-oswald font-bold text-2xl text-white mt-1 mb-2 hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

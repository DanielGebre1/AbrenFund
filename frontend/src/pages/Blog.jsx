import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Book, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Blog = () => {
  // Sample blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'How to Create a Compelling Crowdfunding Campaign',
      excerpt: 'Learn the essential elements of a successful campaign that attracts backers and reaches its funding goals.',
      category: 'Fundraising Tips',
      date: 'April 2, 2025',
      author: 'Selam Bekele',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 2,
      title: 'The Impact of Student-Led Innovation Projects',
      excerpt: 'Explore how university crowdfunding platforms are fostering innovation and real-world impact through student projects.',
      category: 'Impact',
      date: 'March 25, 2025',
      author: 'Dawit Abebe',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 3,
      title: 'From Idea to Market: Commercializing Research Through Crowdfunding',
      excerpt: 'A guide for researchers looking to bridge the gap between academic innovation and commercial viability.',
      category: 'Research',
      date: 'March 18, 2025',
      author: 'Hanna Tesfaye',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
    },
    {
      id: 4,
      title: 'Community Engagement Strategies for Project Creators',
      excerpt: 'Building and maintaining an engaged community around your project before, during, and after your campaign.',
      category: 'Community',
      date: 'March 10, 2025',
      author: 'Yonas Haile',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8f7c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
    }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-muted-foreground max-w-2xl">
              Insights, tips, and stories from the AbrenFund community to help you launch and 
              grow your crowdfunding campaign.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-80 object-cover"
                />
              </div>
              <div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-primary">
                    {featuredPost.category}
                  </span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground inline-flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-3">{featuredPost.title}</h2>
                <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-muted rounded-full mr-3"></div>
                  <p className="font-medium">{featuredPost.author}</p>
                </div>
                <Button>Read Article</Button>
              </div>
            </div>
          </div>

          {/* Regular Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map(post => (
                <div key={post.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-primary">
                        {post.category}
                      </span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-muted rounded-full mr-2"></div>
                        <p className="text-sm font-medium">{post.author}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Book className="h-4 w-4 mr-1" />
                        Read
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline">
                Load More Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-muted/30 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest fundraising tips, success stories, and platform updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 border rounded-md flex-grow"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/sections/PageBanner';
import CTASection from '../components/sections/CTASection';
import { db } from '../utils/db';
import { FaChevronRight } from 'react-icons/fa';

export default function Blogs() {
  const blogsData = db.getBlogs();
  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      <PageBanner 
        title="Industrial Insights & Compliance" 
        subtitle="Technical updates, engineering guides, and power optimization recommendations."
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogsData.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-slate-50 border border-slate-200/60 rounded-xl p-8 hover:border-industrial-cyan/25 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between min-h-[350px] shadow-sm hover:shadow-md"
              >
                <div>
                  <span className="text-[10px] text-industrial-cyan uppercase font-heading font-semibold tracking-widest block mb-3">
                    {blog.date} • {blog.readTime}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.summary}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4 mt-6 flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    By {blog.author}
                  </span>
                  <Link 
                    to={`/blogs/${blog.slug}`} 
                    className="text-industrial-cyan text-sm font-semibold hover:text-slate-900 font-heading inline-flex items-center gap-1.5"
                  >
                    Read Guide <FaChevronRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <CTASection />
    </div>
  );
}

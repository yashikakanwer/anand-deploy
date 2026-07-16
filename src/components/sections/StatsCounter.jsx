import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../utils/LanguageContext';

function CounterItem({ target, suffix, label }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target);
      return;
    }
    
    const duration = 2000; // 2 seconds
    const incrementTime = Math.max(Math.floor(duration / end), 16); // limit to 60fps
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <div 
      ref={elementRef}
      className="bg-white border border-slate-200/60 rounded-xl p-8 text-center relative overflow-hidden group hover:border-industrial-cyan/20 transition-all duration-500 hover:-translate-y-2 shadow-lg"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-industrial-cyan group-hover:h-full transition-all duration-300"></div>
      <div className="font-heading font-bold text-4.5xl md:text-5xl text-slate-900 mb-2 leading-none">
        {count}{suffix}
      </div>
      <div className="text-slate-500 uppercase font-heading text-xs tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function StatsCounter({ cols = "grid-cols-2 md:grid-cols-4" }) {
  const { t } = useLanguage();
  const stats = [
    { target: "18", suffix: "+", label: t("yearsOfService") },
    { target: "515", suffix: "+", label: t("completedProjects") },
    { target: "400", suffix: "+", label: t("happyClients") },
    { target: "25", suffix: "+", label: t("staffMembers") }
  ];

  return (
    <div className={`grid ${cols} gap-6`}>
      {stats.map((stat, index) => (
        <CounterItem 
          key={index}
          target={stat.target}
          suffix={stat.suffix}
          label={stat.label}
        />
      ))}
    </div>
  );
}

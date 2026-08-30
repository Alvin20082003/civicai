import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, GitBranch, Database, Brain, Lock, UserCheck, TrendingUp, LineChart, Check, Network } from 'lucide-react';
import { features, technologies, trustBadges } from '@/lib/indiaData';

const iconMap = {
  'shield-check': ShieldCheck,
  'git-branch': GitBranch,
  database: Database,
  brain: Brain,
  lock: Lock,
  'user-check': UserCheck,
  'trending-up': TrendingUp,
  'line-chart': LineChart,
  network: Network,
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-heading font-bold text-base">CivicAI</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#tech" className="hover:text-foreground transition-colors">Technology</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link to="/dashboard" className="gradient-bg text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Start Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-civic-blue/5 border border-civic-blue/10 mb-6">
              <ShieldCheck className="h-3.5 w-3.5 text-civic-blue" />
              <span className="text-xs font-medium text-civic-blue">India's Responsible AI Government Platform</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-foreground">
              India's AI-Powered <span className="gradient-text">Digital Government Super App</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Aadhaar-linked identity, household AI analysis, 8-language support, and voice AI — combining the best of Singpass, DigiLocker, UMANG, and Aadhaar into one seamless citizen experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="gradient-bg text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-civic-blue/20">
                Start Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/architecture" className="bg-white border border-border text-foreground font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                Explore Platform
              </Link>
            </div>
          </motion.div>

          {/* Trust badges strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex flex-wrap gap-2.5"
          >
            {trustBadges.map((b) => {
              const Icon = iconMap[b.icon] || Check;
              return (
                <span key={b.label} className="trust-badge">
                  <Icon className="h-3 w-3" /> {b.label}
                </span>
              );
            })}
          </motion.div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Languages Supported', value: '8' },
              { label: 'Government Schemes', value: '200+' },
              { label: 'Aadhaar Verified', value: '100%' },
              { label: 'Avg. Confidence Score', value: '94%' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-5">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="section-eyebrow mb-3">Platform Capabilities</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              India's most trusted Responsible AI Government Platform
            </h2>
            <p className="mt-4 text-muted-foreground">
              From Aadhaar-linked identity to household-wide benefit analysis, every feature is designed to make government services accessible to every citizen in their preferred language.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Check;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="glass-card rounded-xl p-6 hover:shadow-lg hover:shadow-civic-blue/8 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg gradient-bg-soft border border-civic-blue/10 mb-4">
                    <Icon className="h-5 w-5 text-civic-blue" />
                  </div>
                  <h3 className="font-heading font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture preview */}
      <section id="architecture" className="py-24 border-t border-border mesh-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="section-eyebrow mb-3">System Architecture</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              From citizen query to government submission — fully auditable
            </h2>
          </div>
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="space-y-3">
              {['Citizen', 'Conversational AI', 'Rule Engine', 'Verified Government Knowledge Base', 'Retrieval-Augmented Generation (RAG)', 'Explainable AI Layer', 'Government Services', 'Audit & Governance Layer'].map((layer, i) => (
                <div key={layer} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 glass-card rounded-lg px-5 py-3.5">
                    <span className="font-medium text-sm">{layer}</span>
                  </div>
                  {i < 7 && <div className="absolute" />}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/architecture" className="inline-flex items-center gap-2 text-sm font-semibold text-civic-blue hover:text-civic-teal transition-colors">
              View full architecture <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section id="tech" className="py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="section-eyebrow mb-3">Technology Stack</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              Built on principles of digital trust and accountability
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {technologies.map((tech) => (
              <span key={tech} className="px-4 py-2.5 rounded-xl bg-muted/60 border border-border text-sm font-medium text-foreground hover:border-civic-blue/20 hover:bg-civic-blue/5 transition-all">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl gradient-bg p-12 md:p-16 text-center">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="relative">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">
                Experience the future of trusted digital government
              </h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto">
                Explore the full platform — AI assistant, governance center, decision logs, and predictive analytics.
              </p>
              <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 bg-white text-civic-blue font-semibold px-6 py-3.5 rounded-xl hover:bg-white/95 transition-colors">
                Start Demo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-bg">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="font-heading font-semibold text-sm">CivicAI</span>
          </div>
          <p className="text-xs text-muted-foreground">Responsible AI Government Platform — Privacy by Design · Security by Design · Digital Trust</p>
        </div>
      </footer>
    </div>
  );
}
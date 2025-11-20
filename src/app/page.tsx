import Link from "next/link";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-12">

          {/* Hero Section */}
          <div className="space-y-6 max-w-4xl animate-float">
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="gradient-text">AI-Powered Resume Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              Build Your Perfect
              <br />
              <span className="gradient-text animate-shimmer bg-gradient-animated">
                Career Story
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create stunning, ATS-optimized resumes in minutes with our intelligent AI assistant.
              Stand out from the crowd and land your dream job.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/signup"
              className="group btn-gradient px-8 py-4 rounded-full text-white font-semibold text-lg flex items-center gap-2 shadow-2xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="glass-strong px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/15 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl">
            <div className="glass-card group">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-fit mb-4 glow-purple">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 gradient-text">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate professional resumes in minutes with our AI-powered conversation flow.
              </p>
            </div>

            <div className="glass-card group">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl w-fit mb-4 glow-cyan">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 gradient-text-accent">ATS Optimized</h3>
              <p className="text-muted-foreground">
                Beat applicant tracking systems with perfectly formatted, keyword-rich resumes.
              </p>
            </div>

            <div className="glass-card group">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl w-fit mb-4 glow-pink">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 gradient-text-secondary">Beautiful Design</h3>
              <p className="text-muted-foreground">
                Stand out with stunning, professional designs that capture recruiters' attention.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 glass px-8 py-4 rounded-2xl">
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="gradient-text font-bold">10,000+</span> job seekers to create their perfect resume
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

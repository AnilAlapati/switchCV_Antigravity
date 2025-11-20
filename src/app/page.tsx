import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar Placeholder (can be separated later) */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold text-black">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">SwitchCV</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">

          {/* Hero Section */}
          <div className="flex flex-col items-center text-center space-y-8 mb-32">
            <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-indigo-300 mb-4">
              <Sparkles className="w-3 h-3" />
              <span>AI-Powered Resume Builder V2.0</span>
            </div>

            <h1 className="animate-fade-in text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]">
              Craft your career story with <br />
              <span className="text-gradient-accent">intelligent design.</span>
            </h1>

            <p className="animate-fade-in-delay text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
              SwitchCV transforms your experience into a professional, ATS-optimized resume in minutes. No templates to fiddle with, just pure content strategy.
            </p>

            <div className="animate-fade-in-delay flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Link href="/signup" className="btn-primary h-12 px-8 text-base">
                Build My Resume
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/login" className="btn-secondary h-12 px-8 text-base">
                View Examples
              </Link>
            </div>

            {/* Hero Visual / Dashboard Preview */}
            <div className="animate-fade-in-delay mt-16 w-full max-w-5xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl aspect-[16/9] flex items-center justify-center">
                {/* Placeholder for UI Mockup */}
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Interactive Resume Builder Preview</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid (Bento Style) */}
          <div className="grid md:grid-cols-3 gap-6 mb-32">
            <div className="premium-card p-8 col-span-1 md:col-span-2">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Lightning Fast Generation</h3>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Our AI analyzes your input and generates a perfectly formatted resume in seconds. Skip the hours of formatting and focus on applying.
              </p>
            </div>

            <div className="premium-card p-8">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">ATS Optimized</h3>
              <p className="text-gray-400 leading-relaxed">
                Built to pass Applicant Tracking Systems with clean code and standard formatting.
              </p>
            </div>

            <div className="premium-card p-8">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Suggestions</h3>
              <p className="text-gray-400 leading-relaxed">
                Get instant feedback on your bullet points to maximize impact.
              </p>
            </div>

            <div className="premium-card p-8 col-span-1 md:col-span-2">
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-3">Ready to switch?</h3>
                <p className="text-gray-400 mb-6">
                  Join thousands of professionals who have upgraded their career with SwitchCV.
                </p>
                <div className="flex gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-black flex items-center justify-center text-xs text-gray-500">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 self-center">+2,000 others</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SwitchCV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

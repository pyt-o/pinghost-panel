import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Server, Shield, Zap, Clock, CreditCard, HeadphonesIcon } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {APP_TITLE}
            </h1>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Professional Game Server Hosting
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Deploy and manage your game servers with ease. Powerful control panel, instant setup, and 24/7 support.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-6">
            <a href={getLoginUrl()}>Get Started Now</a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Instant Deployment</h3>
            <p className="text-slate-400">
              Launch your server in seconds with our automated setup system. No technical knowledge required.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">DDoS Protection</h3>
            <p className="text-slate-400">
              Enterprise-grade security keeps your servers safe from attacks and ensures maximum uptime.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">99.9% Uptime</h3>
            <p className="text-slate-400">
              Reliable infrastructure with redundant systems ensures your servers stay online 24/7.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
              <Server className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Full Control Panel</h3>
            <p className="text-slate-400">
              Manage files, databases, and settings through our intuitive web interface.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Flexible Billing</h3>
            <p className="text-slate-400">
              Pay only for what you use with hourly, daily, or monthly billing options.
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
              <HeadphonesIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">24/7 Support</h3>
            <p className="text-slate-400">
              Our expert team is always ready to help through our ticket system.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to Get Started?</h3>
          <p className="text-slate-400 mb-6">Join thousands of gamers hosting their servers with PingHost</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <a href={getLoginUrl()}>Create Your Account</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

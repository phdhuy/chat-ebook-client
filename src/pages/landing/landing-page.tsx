import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Brain,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out 0.5s forwards;
            opacity: 0;
          }
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                ChatEbook
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="hover:text-purple-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-purple-400 transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="hover:text-purple-400 transition-colors"
              >
                Pricing
              </a>
              <Link to="/sign-in">
                <Button
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="inline-flex items-center space-x-2 bg-purple-900/30 border border-purple-400/30 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">
                  Powered by Advanced RAG AI
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Read Smarter,
                <br />
                <span>Ask Better</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Transform your ebook reading experience with AI-powered Q&A. Get
                instant answers, deep insights, and personalized discussions
                about any book.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link to="/app">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 text-lg group"
                  >
                    Start Reading Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black px-8 py-4 text-lg bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Animated Book Preview */}
            <div
              className={`relative transition-all duration-1500 delay-500 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-purple-900/50 to-black/50 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 shadow-2xl">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-purple-400">
                        <BookOpen className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Currently Reading
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">The Art of War</h3>
                      <p className="text-gray-400">by Sun Tzu</p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-black/50 rounded-lg p-4 border-l-4 border-purple-400">
                        <p className="text-sm text-gray-300">
                          "What are the key principles of strategic thinking?"
                        </p>
                      </div>
                      <div className="bg-purple-900/30 rounded-lg p-4">
                        <p className="text-sm">
                          The key principles include knowing yourself and your
                          enemy, adapting to circumstances, and using deception
                          strategically...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-purple-600/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-6 py-20 bg-gradient-to-r from-purple-950/50 to-black/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                Revolutionize Your Reading
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of ebook interaction with our advanced RAG
                AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Smart Q&A",
                  description:
                    "Ask any question about your book and get intelligent, contextual answers powered by RAG AI",
                  color: "from-purple-600 to-purple-400",
                },
                {
                  icon: Search,
                  title: "Deep Search",
                  description:
                    "Find specific information, themes, and concepts across your entire library instantly",
                  color: "from-purple-500 to-purple-300",
                },
                {
                  icon: MessageSquare,
                  title: "Interactive Discussions",
                  description:
                    "Engage in meaningful conversations about characters, plot, and themes with AI",
                  color: "from-purple-400 to-purple-200",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="bg-black/50 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 group"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Three simple steps to transform your reading experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your Ebook",
                  description:
                    "Simply upload your favorite ebooks in any format. Our AI processes and understands the content.",
                },
                {
                  step: "02",
                  title: "Start Reading",
                  description:
                    "Read naturally while our RAG AI builds a comprehensive understanding of the book's context.",
                },
                {
                  step: "03",
                  title: "Ask & Explore",
                  description:
                    "Ask questions, explore themes, and dive deeper into the content with intelligent AI responses.",
                },
              ].map((step, index) => (
                <div key={index} className="relative group">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 text-2xl font-bold mb-6 group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-600 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-purple-900/30 to-black/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Ready to Transform Your Reading?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of readers who are already experiencing the future
              of ebook interaction
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-12 py-4 text-lg group"
                >
                  Get Started Free
                  <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-gray-400">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-purple-400/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <BookOpen className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                  ChatEbook
                </span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-purple-400 transition-colors">
                  Support
                </a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-purple-400/10 text-center text-sm text-gray-500">
              © 2025 ChatEbook. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

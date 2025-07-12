"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Target,
  Camera,
  Stethoscope,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Play,
  ChevronRight,
  Star,
  Calendar,
  Trophy,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const featuredWings = [
    { name: "Media Wing", icon: Camera, description: "Capturing moments and sharing stories", href: "/wings" },
    {
      name: "Medical Wing",
      icon: Stethoscope,
      description: "Health awareness and medical support",
      href: "/wings",
    },
    {
      name: "Discourse Hub",
      icon: MessageCircle,
      description: "Platform for meaningful discussions",
      href: "/wings",
    },
    { name: "GK Wing", icon: GraduationCap, description: "General knowledge and current affairs", href: "/wings" },
  ]

  const recentNews = [
    {
      title: "Annual Cultural Fest 2025",
      description: "Join us for the biggest cultural celebration of the year",
      date: "Jan 15, 2025",
      type: "Event",
    },
    {
      title: "New Wing Formations",
      description: "Exciting new wings added to serve students better",
      date: "Jan 10, 2025",
      type: "Announcement",
    },
    {
      title: "Quiz Competition Results",
      description: "Congratulations to all participants and winners",
      date: "Jan 8, 2025",
      type: "Results",
    },
  ]

  const stats = [
    { label: "Active Students", value: "500+", icon: Users },
    { label: "Active Wings", value: "11", icon: Target },
    { label: "Class Unions", value: "6", icon: GraduationCap },
    { label: "Monthly Events", value: "15+", icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - Modern Glass Morphism Style */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background with glass morphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-violet-50/80 backdrop-blur-sm z-0"></div>
        
        {/* Animated background shapes - Responsive positioning */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 sm:top-40 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 sm:left-1/3 w-48 h-48 sm:w-72 sm:h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-blue-100/80 backdrop-blur-sm text-blue-700 font-medium text-xs sm:text-sm tracking-wider shadow-sm mb-2 animate-fade-in-down">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                SA'ADA Students' Union
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-sm animate-fade-in-up">
                Empowering Students through <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Unity</span> <br className="hidden sm:inline" />
                and <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Knowledge</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up delay-100">
                Building bridges between students, fostering academic excellence, and creating a vibrant community where every voice matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start animate-fade-in-up delay-200">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg rounded-full px-6 sm:px-8 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
                  <Link href="/about">
                    <span className="flex items-center">
                      Learn More
                      <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-6 sm:px-8 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
                  <Link href="/quiz">
                    <span className="flex items-center">
                      <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                      Join Live Quiz
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
            {/* Right: Image with Card - Modern 3D effect */}
            <div className="relative order-1 lg:order-2 flex justify-center">
              <div className="relative transform transition-all duration-700 hover:rotate-2 hover:scale-105 w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 blur-xl opacity-20 transform -rotate-6"></div>
                <Image
                  src="/hero-section-image.png"
                  alt="Students Unity"
                  width={600}
                  height={500}
                  className="rounded-2xl sm:rounded-3xl shadow-2xl w-full h-auto border-4 sm:border-8 border-white relative z-10"
                  priority
                />
                {/* Floating Card - Glass morphism style - Responsive */}
                <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-lg sm:rounded-xl shadow-xl px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-4 border border-white/20 animate-float">
                  <div className="p-1.5 sm:p-2 bg-yellow-400/20 backdrop-blur-sm rounded-full">
                    <Star className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm sm:text-lg">500+ Active Students</div>
                    <div className="text-xs text-gray-500">Join our vibrant community</div>
                  </div>
                </div>
                {/* Decorative Star - Modern glow effect - Responsive */}
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Cards with Hover Effects */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-b from-white to-gray-50 overflow-hidden group">
                <CardContent className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">{stat.value}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Wings - Modern Card Grid with Animations */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="px-3 sm:px-4 py-1.5 mb-4 bg-blue-100 text-blue-700 rounded-full font-medium text-xs sm:text-sm">Our Wings</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Wings</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover our most active wings working to serve students across various domains
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredWings.map((wing, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-none shadow-md overflow-hidden bg-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="text-center pb-4 relative z-10 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300 transform group-hover:rotate-6">
                    <wing.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{wing.name}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 px-4 sm:px-6">
                  <CardDescription className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                    {wing.description}
                  </CardDescription>
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm" asChild>
                    <Link href={wing.href}>
                      Learn More
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-6 sm:px-8 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
              <Link href="/wings">
                View All Wings
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent News - Modern Card Design */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="px-3 sm:px-4 py-1.5 mb-4 bg-blue-100 text-blue-700 rounded-full font-medium text-xs sm:text-sm">News & Updates</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest Updates</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Stay informed with the latest news and announcements from SA'ADA Students' Union
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentNews.map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-none shadow-md overflow-hidden bg-white"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardHeader className="px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full w-fit">
                      {item.type}
                    </Badge>
                    <span className="text-xs sm:text-sm text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <CardDescription className="text-gray-600 mb-6 text-sm sm:text-base">
                    {item.description}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full px-6 sm:px-8 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
              <Link href="/news">
                View All News
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions - Modern Glass Morphism Cards */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-0"></div>
        
        {/* Animated background shapes - Responsive */}
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="px-3 sm:px-4 py-1.5 mb-4 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium text-xs sm:text-sm">Join Us</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Get Involved</h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto px-4">
              Join our community and participate in various activities and programs
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border-none overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center relative z-10 px-4 sm:px-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 sm:w-10 sm:h-10 text-yellow-400" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Live Quiz Arena</CardTitle>
                <CardDescription className="text-blue-100 text-sm sm:text-base">
                  Test your knowledge and compete with peers
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 px-4 sm:px-6">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
                  <Link href="/quiz">Join Quiz</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border-none overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center relative z-10 px-4 sm:px-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 sm:w-10 sm:h-10 text-green-400" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Student Blog</CardTitle>
                <CardDescription className="text-blue-100 text-sm sm:text-base">
                  Share your thoughts and experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 px-4 sm:px-6">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
                  <Link href="/blog">Write Article</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border-none overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center relative z-10 px-4 sm:px-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 sm:w-10 sm:h-10 text-purple-400" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Class Unions</CardTitle>
                <CardDescription className="text-blue-100 text-sm sm:text-base">
                  Connect with your class representatives
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 px-4 sm:px-6">
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" asChild>
                  <Link href="/class-unions">Explore</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer Links - Modern Styling */}
      <div className="py-6 bg-gray-50 border-t border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 text-sm sm:text-base">Login</Link>
          <span className="hidden sm:inline text-gray-300">|</span>
          <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 text-sm sm:text-base">Sign Up</Link>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  )
}

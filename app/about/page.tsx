"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Award, Calendar, MapPin, Mail, Phone, Globe, BookOpen, Lightbulb, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Unity",
      description: "Building bridges between students from diverse backgrounds and fostering a sense of belonging.",
    },
    {
      icon: BookOpen,
      title: "Knowledge",
      description: "Promoting academic excellence and continuous learning through various educational initiatives.",
    },
    {
      icon: Handshake,
      title: "Service",
      description: "Dedicated to serving the student community and addressing their needs and concerns.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Encouraging creative thinking and innovative solutions to student challenges.",
    },
  ];

  const timeline = [
    {
      year: "2020",
      title: "Foundation",
      description: "SA'ADA Students' Union was established with a vision to unite students.",
    },
    {
      year: "2021",
      title: "First Wings Formation",
      description: "Initial wings were formed including Media, Medical, and Academic wings.",
    },
    {
      year: "2022",
      title: "Digital Transformation",
      description: "Launched online platforms and digital initiatives for better student engagement.",
    },
    {
      year: "2023",
      title: "Expansion",
      description: "Added more specialized wings and increased membership to over 1000 students.",
    },
    {
      year: "2024",
      title: "Recognition",
      description: "Received multiple awards for outstanding student organization management.",
    },
    {
      year: "2025",
      title: "Innovation Hub",
      description: "Launched comprehensive digital platform with quiz systems and interactive features.",
    },
  ];

  const leadership = [
    {
      name: "Anshid",
      position: "President",
      description: "Leading the union with vision and dedication to student welfare.",
      image: "/anshid 1st.png",
    },
    {
      name: "Adheeb",
      position: "Working Vice President",
      description: "Supporting the president and coordinating union activities with dedication.",
      image: "/adheeb.png",
    },
    {
      name: "Faseeh",
      position: "Secretary",
      description: "Responsible for official correspondence and record-keeping.",
      image: "/faseeh.png",
    },
    {
      name: "Anshid D2",
      position: "Working Secretary",
      description: "Assisting in secretarial duties and supporting the union's operations.",
      image: "/anshid d2.png",
    },
    {
      name: "Anshif",
      position: "Joint Secretary",
      description: "Supporting the secretary and managing joint secretarial responsibilities.",
      image: "/anshif.png",
    },
    {
      name: "Shafin",
      position: "Treasurer",
      description: "Overseeing financial management and budget allocation for activities.",
      image: "/shafin.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 lg:mb-6">
                About SA'ADA Students' Union
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                A dynamic organization dedicated to fostering academic excellence, cultural diversity, and student
                welfare through unity, knowledge, and service.
              </p>
            </div>

            <div className="relative order-1 lg:order-2">
              <Image
                src="/about.png"
                alt="SA'ADA Students Union"
                width={1200}
                height={350}
                className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl w-full object-cover h-[250px] sm:h-[300px] lg:h-[350px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Core Values</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              The fundamental principles that guide our actions and shape our community
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Journey</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Key milestones in the growth and development of SA'ADA Students' Union
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-blue-200"></div>

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-8 sm:mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <Badge className="bg-blue-600 text-white w-fit">{item.year}</Badge>
                          <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6">
                        <CardDescription className="text-sm sm:text-base text-gray-600">{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Leadership Team</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Meet the dedicated leaders working tirelessly to serve the student community
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                  <Image
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-3 sm:mb-4 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{leader.name}</h3>
                  <Badge className="mb-3 sm:mb-4 bg-blue-100 text-blue-800 text-xs sm:text-sm">{leader.position}</Badge>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{leader.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Our Impact</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Numbers that reflect our commitment to student success and community building
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Active Members", value: "2,500+", color: "text-blue-600" },
              { icon: Award, label: "Awards Won", value: "25+", color: "text-green-600" },
              { icon: Calendar, label: "Events Organized", value: "150+", color: "text-purple-600" },
              { icon: Globe, label: "Years of Service", value: "5+", color: "text-orange-600" },
            ].map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 sm:mb-4 ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Get in Touch</h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto px-4">
              Have questions or want to get involved? We'd love to hear from you
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="pt-6 sm:pt-8 text-center px-4 sm:px-6">
                <Mail className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-sm sm:text-base text-blue-100">info@saadaunion.edu</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="pt-6 sm:pt-8 text-center px-4 sm:px-6">
                <Phone className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-sm sm:text-base text-blue-100">+91 98765 43210</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-6 sm:pt-8 text-center px-4 sm:px-6">
                <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-sm sm:text-base text-blue-100">Campus Address, City</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-sm sm:text-base" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

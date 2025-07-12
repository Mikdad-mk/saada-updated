"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Trophy, TrendingUp, Calendar, Mail, Phone, MapPin, Star, Award, Clock } from "lucide-react";
import ClassUnionChart from "@/components/charts/class-union-chart";

export default function ClassUnionsPage() {
  const classUnions = [
    {
      name: "Al Mass",
      description: "Excellence in academic pursuits and leadership development",
      president: "Ahmed Hassan",
      vicePresident: "Fatima Al-Zahra",
      totalMembers: 45,
      averageGrade: 87.5,
      achievements: ["Best Academic Performance 2024", "Community Service Award"],
      color: "bg-blue-500",
      contact: {
        email: "almass@saadaunion.edu",
        phone: "+91 98765 43210",
      },
    },
    {
      name: "Siaada",
      description: "Promoting cultural diversity and academic excellence",
      president: "Omar Khalil",
      vicePresident: "Aisha Rahman",
      totalMembers: 42,
      averageGrade: 85.3,
      achievements: ["Cultural Excellence Award", "Best Event Organization"],
      color: "bg-green-500",
      contact: {
        email: "siaada@saadaunion.edu",
        phone: "+91 98765 43211",
      },
    },
    {
      name: "Usba",
      description: "Innovation and technology-focused student community",
      president: "Yusuf Ibrahim",
      vicePresident: "Zainab Malik",
      totalMembers: 38,
      averageGrade: 83.7,
      achievements: ["Innovation Award 2024", "Tech Excellence Recognition"],
      color: "bg-purple-500",
      contact: {
        email: "usba@saadaunion.edu",
        phone: "+91 98765 43212",
      },
    },
    {
      name: "Qaaf",
      description: "Literary excellence and creative expression",
      president: "Hassan Ahmed",
      vicePresident: "Mariam Said",
      totalMembers: 41,
      averageGrade: 82.1,
      achievements: ["Literary Competition Winner", "Creative Arts Award"],
      color: "bg-orange-500",
      contact: {
        email: "qaaf@saadaunion.edu",
        phone: "+91 98765 43213",
      },
    },
    {
      name: "Zahran",
      description: "Sports and physical wellness advocacy",
      president: "Ali Mohammad",
      vicePresident: "Khadija Noor",
      totalMembers: 39,
      averageGrade: 84.9,
      achievements: ["Sports Excellence Award", "Health Awareness Campaign"],
      color: "bg-pink-500",
      contact: {
        email: "zahran@saadaunion.edu",
        phone: "+91 98765 43214",
      },
    },
    {
      name: "Hikma",
      description: "Wisdom and philosophical discourse community",
      president: "Ibrahim Yusuf",
      vicePresident: "Safiya Hassan",
      totalMembers: 44,
      averageGrade: 86.2,
      achievements: ["Philosophy Debate Champion", "Wisdom Circle Award"],
      color: "bg-indigo-500",
      contact: {
        email: "hikma@saadaunion.edu",
        phone: "+91 98765 43215",
      },
    },
  ];

  const upcomingEvents = [
    {
      title: "Inter-Union Quiz Competition",
      date: "Jan 25, 2025",
      time: "6:00 PM",
      location: "Main Auditorium",
      participants: "All Unions",
    },
    {
      title: "Cultural Exchange Program",
      date: "Feb 1, 2025",
      time: "4:00 PM",
      location: "Cultural Center",
      participants: "Al Mass & Siaada",
    },
    {
      title: "Academic Excellence Awards",
      date: "Feb 10, 2025",
      time: "7:00 PM",
      location: "Grand Hall",
      participants: "All Unions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"> 3db Class Unions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Strong class unions working under SA'ADA to represent and serve students at every level
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger
              value="overview"
              className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Perf</span>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Events</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {classUnions.map((union, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${union.color}`}></div>
                        <CardTitle className="text-xl">{union.name}</CardTitle>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{union.totalMembers} Members</Badge>
                    </div>
                    <CardDescription className="text-gray-600">{union.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">President</span>
                        <span className="font-semibold">{union.president}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Vice President</span>
                        <span className="font-semibold">{union.vicePresident}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Average Grade</span>
                        <span className="font-bold text-green-600">{union.averageGrade}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-gray-700">Recent Achievements</h4>
                      {union.achievements.map((achievement, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs mr-2 mb-1">
                          <Trophy className="w-3 h-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{union.contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{union.contact.phone}</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4">Contact Union</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-8">
            <ClassUnionChart />
          </TabsContent>

          <TabsContent value="events" className="space-y-8">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Upcoming Inter-Union Events</span>
                  </CardTitle>
                  <CardDescription>Collaborative events and competitions between class unions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {upcomingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-4"
                      >
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{event.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {event.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {event.time}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {event.location}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {event.participants}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                          Register
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Union Activities */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Monthly Highlights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-sm">Al Mass Leadership Workshop</h4>
                          <p className="text-xs text-gray-600">Conducted leadership training for 30+ students</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-sm">Siaada Cultural Festival</h4>
                          <p className="text-xs text-gray-600">Organized multicultural celebration event</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-sm">Usba Tech Innovation Fair</h4>
                          <p className="text-xs text-gray-600">Showcased student technology projects</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span>Recognition Board</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-sm">Union of the Month</h4>
                          <p className="text-xs text-gray-600">Outstanding performance</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Al Mass</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-sm">Best Event Organization</h4>
                          <p className="text-xs text-gray-600">Cultural exchange program</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Siaada</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-sm">Academic Excellence</h4>
                          <p className="text-xs text-gray-600">Highest average grades</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Hikma</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

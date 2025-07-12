"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Users, Trophy } from "lucide-react"

interface ClassUnionData {
  name: string
  totalStudents: number
  averageMarks: number
  topPerformer: string
  trend: "up" | "down" | "same"
  trendValue: number
  color: string
}

const classUnionData: ClassUnionData[] = [
  {
    name: "Al Mass",
    totalStudents: 45,
    averageMarks: 87.5,
    topPerformer: "Ahmed Hassan",
    trend: "up",
    trendValue: 5.2,
    color: "bg-blue-500",
  },
  {
    name: "Siaada",
    totalStudents: 42,
    averageMarks: 85.3,
    topPerformer: "Fatima Ali",
    trend: "up",
    trendValue: 3.1,
    color: "bg-green-500",
  },
  {
    name: "Usba",
    totalStudents: 38,
    averageMarks: 83.7,
    topPerformer: "Omar Khalil",
    trend: "same",
    trendValue: 0.5,
    color: "bg-purple-500",
  },
  {
    name: "Qaaf",
    totalStudents: 41,
    averageMarks: 82.1,
    topPerformer: "Aisha Rahman",
    trend: "down",
    trendValue: -2.3,
    color: "bg-orange-500",
  },
  {
    name: "Zahran",
    totalStudents: 39,
    averageMarks: 84.9,
    topPerformer: "Yusuf Ibrahim",
    trend: "up",
    trendValue: 4.7,
    color: "bg-pink-500",
  },
  {
    name: "Hikma",
    totalStudents: 44,
    averageMarks: 86.2,
    topPerformer: "Zainab Malik",
    trend: "up",
    trendValue: 2.8,
    color: "bg-indigo-500",
  },
]

export default function ClassUnionChart() {
  const sortedData = [...classUnionData].sort((a, b) => b.averageMarks - a.averageMarks)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
      default:
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span>Class Union Performance Rankings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {sortedData.map((union, index) => (
              <div
                key={union.name}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                  index === 0 ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                    <span className="text-sm sm:text-lg font-bold text-gray-600">#{index + 1}</span>
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${union.color}`}></div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{union.name}</h3>
                  </div>
                  {index === 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs hidden sm:inline-flex">
                      🏆 Top Performer
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-sm sm:text-lg text-gray-800">{union.averageMarks}%</p>
                    <p className="text-xs sm:text-sm text-gray-600">{union.totalStudents} students</p>
                  </div>
                  <div className={`flex items-center space-x-1 ${getTrendColor(union.trend)}`}>
                    {getTrendIcon(union.trend)}
                    <span className="text-xs sm:text-sm font-medium">
                      {union.trend !== "same" ? `${Math.abs(union.trendValue)}%` : "0%"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Performance Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classUnionData.map((union) => (
          <Card key={union.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${union.color}`}></div>
                  <span>{union.name}</span>
                </div>
                {getTrendIcon(union.trend)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Marks</span>
                  <span className="font-semibold">{union.averageMarks}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${union.color} transition-all duration-500`}
                    style={{ width: `${(union.averageMarks / 100) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 flex items-center">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Total Students
                </span>
                <span className="font-semibold">{union.totalStudents}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Top Performer</span>
                <span className="font-semibold text-blue-600 truncate ml-2">{union.topPerformer}</span>
              </div>

              <div className={`flex items-center justify-between text-sm ${getTrendColor(union.trend)}`}>
                <span>Monthly Change</span>
                <span className="font-semibold">
                  {union.trend === "up" ? "+" : union.trend === "down" ? "-" : ""}
                  {Math.abs(union.trendValue)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

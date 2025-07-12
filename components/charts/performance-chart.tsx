"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target } from "lucide-react"

interface PerformanceData {
  month: string
  participants: number
  averageScore: number
  completionRate: number
}

const performanceData: PerformanceData[] = [
  { month: "Sep", participants: 120, averageScore: 78, completionRate: 85 },
  { month: "Oct", participants: 145, averageScore: 82, completionRate: 88 },
  { month: "Nov", participants: 168, averageScore: 85, completionRate: 92 },
  { month: "Dec", participants: 192, averageScore: 87, completionRate: 94 },
  { month: "Jan", participants: 215, averageScore: 89, completionRate: 96 },
]

export default function PerformanceChart() {
  const maxParticipants = Math.max(...performanceData.map((d) => d.participants))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Participation Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span>Participation Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {performanceData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-8 sm:w-12">{data.month}</span>
                <div className="flex-1 mx-3 sm:mx-4">
                  <div className="bg-gray-200 rounded-full h-2 sm:h-3">
                    <div
                      className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(data.participants / maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-800 w-8 sm:w-12 text-right">{data.participants}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Average Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span>Average Scores</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {performanceData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-8 sm:w-12">{data.month}</span>
                <div className="flex-1 mx-3 sm:mx-4">
                  <div className="bg-gray-200 rounded-full h-2 sm:h-3">
                    <div
                      className="bg-green-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                      style={{ width: `${data.averageScore}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-800 w-10 sm:w-12 text-right">{data.averageScore}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

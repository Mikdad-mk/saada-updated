"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
  quizzes: number
  accuracy: number
  trend: "up" | "down" | "same"
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Ahmed Hassan", score: 2450, quizzes: 25, accuracy: 92, trend: "up" },
  { rank: 2, name: "Fatima Ali", score: 2380, quizzes: 23, accuracy: 89, trend: "up" },
  { rank: 3, name: "Omar Khalil", score: 2320, quizzes: 24, accuracy: 87, trend: "same" },
  { rank: 4, name: "Aisha Rahman", score: 2280, quizzes: 22, accuracy: 91, trend: "up" },
  { rank: 5, name: "Yusuf Ibrahim", score: 2240, quizzes: 21, accuracy: 85, trend: "down" },
  { rank: 6, name: "Zainab Malik", score: 2200, quizzes: 20, accuracy: 88, trend: "up" },
  { rank: 7, name: "Hassan Ahmed", score: 2150, quizzes: 19, accuracy: 84, trend: "same" },
  { rank: 8, name: "Mariam Said", score: 2100, quizzes: 18, accuracy: 86, trend: "up" },
]

export default function LeaderboardChart() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      case 3:
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
      default:
        return (
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-500">
            #{rank}
          </span>
        )
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          <span>Top Performers</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                entry.rank <= 3 ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{entry.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{entry.quizzes} quizzes completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                <div className="text-right">
                  <p className="font-bold text-sm sm:text-lg text-gray-800">{entry.score}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{entry.accuracy}% accuracy</p>
                </div>
                <div className={`flex items-center ${getTrendColor(entry.trend)}`}>
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                {entry.rank <= 3 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs hidden sm:inline-flex">
                    Top 3
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

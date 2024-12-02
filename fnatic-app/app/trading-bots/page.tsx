"use client"

import { useState } from "react"
import { Bell, Bot, Brain, ChevronDown, LineChart, MessageSquare, Rocket, Search, TrendingUp, Twitter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Dummy data for trading bots
const tradingBots = [
  {
    id: 1,
    name: "SmartTrend AI",
    description: "Uses machine learning to identify trending tokens from your Twitter activity",
    type: "Social Sentiment",
    pool: "ETH/USDT",
    performance: "+12.5%",
    risk: "Medium",
    icon: Brain,
  },
  {
    id: 2,
    name: "Momentum Master",
    description: "Technical analysis based trading using multiple timeframe momentum",
    type: "Technical",
    pool: "BTC/USDT",
    performance: "+8.2%",
    risk: "High",
    icon: TrendingUp,
  },
  {
    id: 3,
    name: "Social Signal Bot",
    description: "Tracks crypto influencers and their token mentions for trading signals",
    type: "Social Sentiment",
    pool: "SOL/USDT",
    performance: "+15.7%",
    risk: "High",
    icon: Twitter,
  },
  {
    id: 4,
    name: "Volume Scout",
    description: "Identifies and trades tokens with unusual volume patterns",
    type: "Technical",
    pool: "MATIC/USDT",
    performance: "+5.3%",
    risk: "Medium",
    icon: LineChart,
  },
  {
    id: 5,
    name: "DeFi Pulse",
    description: "Monitors DeFi protocols for governance and protocol changes",
    type: "Fundamental",
    pool: "UNI/USDT",
    performance: "+10.1%",
    risk: "Low",
    icon: Rocket,
  },
]

export default function TradingBots() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPool, setSelectedPool] = useState("All Pools")

  const filteredBots = tradingBots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedPool === "All Pools" || bot.pool === selectedPool)
  )

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            AI Trading Bots
          </h1>
          <p className="text-slate-300">
            Autonomous trading powered by machine learning and social sentiment analysis
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search trading bots..."
              className="pl-10 bg-[#1a1b1e] border-gray-800 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#1a1b1e] border-gray-800">
                {selectedPool} <ChevronDown className="ml-2" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1b1e] border-gray-800">
              <DropdownMenuItem onClick={() => setSelectedPool("All Pools")}>All Pools</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPool("ETH/USDT")}>ETH/USDT</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPool("BTC/USDT")}>BTC/USDT</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPool("SOL/USDT")}>SOL/USDT</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Trading Bots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => (
            <Card key={bot.id} className="bg-[#1a1b1e] border-gray-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <bot.icon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-200 text-lg">{bot.name}</CardTitle>
                      <CardDescription className="text-slate-300">{bot.type}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      bot.risk === "Low"
                        ? "border-green-500 text-green-500"
                        : bot.risk === "Medium"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-red-500 text-red-500"
                    }
                  >
                    {bot.risk} Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300">{bot.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Pool: {bot.pool}</span>
                  <span className="text-green-500">{bot.performance} (30d)</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Bot className="mr-2 h-4 w-4" />
                      Activate Bot
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1b1e] border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Configure {bot.name}</DialogTitle>
                      <DialogDescription className="text-slate-300">Customize your trading bot parameters</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Twitter Integration</Label>
                          <p className="text-sm text-slate-300">Allow bot to analyze your Twitter activity</p>
                        </div>
                        <Switch className="border-red-100"/>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Notifications</Label>
                          <p className="text-sm text-slate-300">Receive trade alerts and performance updates</p>
                        </div>
                        <Switch className="border-red-100"/>
                      </div>
                      <div className="space-y-1">
                        <Label>Trading Amount (USDT)</Label>
                        <Input type="number" placeholder="Enter amount" className="bg-[#0a0b0d] border-gray-800" />
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Rocket className="mr-2 h-4 w-4" />
                        Launch Bot
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


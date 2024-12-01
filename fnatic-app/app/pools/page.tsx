'use client'

import React from 'react'
import { Button } from "../../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { PlusCircle } from 'lucide-react'

interface Pool {
  id: number
  name: string
  type: string
  tvl: string
  volatility: string
  fee: string
  lastUpdate: string
}

const pools: Pool[] = [
  {
    id: 1,
    name: "USDC/ETH",
    type: "Dynamic",
    tvl: "$225.37m",
    volatility: "0.00% / 1.39% / 2.20%",
    fee: "↑ 24% 0.97%",
    lastUpdate: new Date(Date.now() - 10 * 1000).toLocaleString(),
  },
  // Add more pool data as needed
]

export default function Pools() {
  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <div className="flex justify-between items-center mb-6 w-5/6">
        <h1 className="text-2xl font-bold">All Pools</h1>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add liquidity
        </Button>
      </div>
      <div className="rounded-lg overflow-hidden w-5/6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-800">
              <TableHead className="text-gray-400">#</TableHead>
              <TableHead className="text-gray-400">Pool</TableHead>
              <TableHead className="text-gray-400">TVL</TableHead>
              <TableHead className="text-gray-400">Volatility</TableHead>
              <TableHead className="text-gray-400">Fee</TableHead>
              <TableHead className="text-gray-400">Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id} className="border-b border-gray-700">
                <TableCell className="font-medium">{pool.id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="mr-2">🔵⚪</span> {/* Replace with actual token icons */}
                    {pool.name}
                    <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full">{pool.type}</span>
                  </div>
                </TableCell>
                <TableCell>{pool.tvl}</TableCell>
                <TableCell>{pool.volatility}</TableCell>
                <TableCell>{pool.fee}</TableCell>
                <TableCell>{pool.lastUpdate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
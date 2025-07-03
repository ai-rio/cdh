"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface CashflowData {
  month: string
  projected: number
  actual: number
}

// Mock cashflow data
const mockCashflowData: CashflowData[] = [
  { month: 'Jan', projected: 12000, actual: 11500 },
  { month: 'Feb', projected: 15000, actual: 16200 },
  { month: 'Mar', projected: 18000, actual: 17800 },
  { month: 'Apr', projected: 22000, actual: 24500 },
  { month: 'May', projected: 25000, actual: 23800 },
  { month: 'Jun', projected: 28000, actual: 29200 },
  { month: 'Jul', projected: 32000, actual: 31500 },
  { month: 'Aug', projected: 35000, actual: 36800 },
  { month: 'Sep', projected: 38000, actual: 37200 },
  { month: 'Oct', projected: 42000, actual: 43500 },
  { month: 'Nov', projected: 45000, actual: 44800 },
  { month: 'Dec', projected: 50000, actual: 52000 }
]

const CashflowChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const [chartData, setChartData] = useState<any>(null)

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenVisible) {
            setHasBeenVisible(true)
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully visible
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [hasBeenVisible])

  // Chart initialization when becomes visible
  useEffect(() => {
    if (hasBeenVisible) {
      const data = {
        labels: mockCashflowData.map(item => item.month),
        datasets: [
          {
            label: 'Projected Revenue',
            data: mockCashflowData.map(item => item.projected),
            backgroundColor: 'rgba(163, 230, 53, 0.6)', // lime-400 with opacity
            borderColor: 'rgba(163, 230, 53, 1)', // lime-400
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          },
          {
            label: 'Actual Revenue',
            data: mockCashflowData.map(item => item.actual),
            backgroundColor: 'rgba(34, 197, 94, 0.6)', // green-500 with opacity
            borderColor: 'rgba(34, 197, 94, 1)', // green-500
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          }
        ]
      }
      setChartData(data)
    }
  }, [hasBeenVisible])

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context) => {
        // Stagger animation for each bar
        return context.dataIndex * 100
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 14,
            weight: 500
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
      title: {
        display: true,
        text: 'Monthly Revenue Tracking',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(163, 230, 53, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y
            return `${context.dataset.label}: $${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af', // gray-400
          font: {
            size: 12,
            weight: 500
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9ca3af', // gray-400
          font: {
            size: 12,
            weight: 500
          },
          callback: function(value) {
            return '$' + (value as number).toLocaleString()
          }
        },
        beginAtZero: true
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto">
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardContent className="p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Revenue Analytics Dashboard
            </h3>
            <p className="text-gray-400">
              Track your projected vs actual revenue performance
            </p>
          </div>
          
          {/* Chart Container */}
          <div className="relative h-96 w-full">
            {hasBeenVisible && chartData ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading chart...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Key Metrics */}
          {hasBeenVisible && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Total Projected</p>
                <p className="text-2xl font-bold text-lime-400">
                  ${mockCashflowData.reduce((sum, item) => sum + item.projected, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Total Actual</p>
                <p className="text-2xl font-bold text-green-500">
                  ${mockCashflowData.reduce((sum, item) => sum + item.actual, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Performance</p>
                <p className="text-2xl font-bold text-white">
                  {(
                    (mockCashflowData.reduce((sum, item) => sum + item.actual, 0) / 
                     mockCashflowData.reduce((sum, item) => sum + item.projected, 0)) * 100
                  ).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default CashflowChart
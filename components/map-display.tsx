"use client"

import { useEffect, useRef } from "react"

interface MapDisplayProps {
  latitude: number
  longitude: number
  zoom?: number
}

export function MapDisplay({ latitude, longitude, zoom = 13 }: MapDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Create a simple map visualization using OpenStreetMap
    const width = mapContainer.current.clientWidth
    const height = mapContainer.current.clientHeight

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Draw background
    ctx.fillStyle = "#e0e7ff"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#c7d2fe"
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Draw marker
    const markerX = width / 2
    const markerY = height / 2

    // Draw pin shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.beginPath()
    ctx.ellipse(markerX, markerY + 20, 15, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw pin
    ctx.fillStyle = "#4f46e5"
    ctx.beginPath()
    ctx.moveTo(markerX, markerY - 20)
    ctx.lineTo(markerX + 12, markerY + 5)
    ctx.arc(markerX, markerY + 5, 12, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()

    // Draw white dot
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(markerX, markerY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw coordinates
    ctx.fillStyle = "#1f2937"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, width / 2, height - 10)

    mapContainer.current.innerHTML = ""
    mapContainer.current.appendChild(canvas)
  }, [latitude, longitude, zoom])

  return <div ref={mapContainer} className="w-full h-64 rounded-lg border border-border bg-muted" />
}

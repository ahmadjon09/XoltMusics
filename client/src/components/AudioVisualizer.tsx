import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AudioVisualizerProps {
    analyser: AnalyserNode
}

export const AudioVisualizer = ({ analyser }: AudioVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!analyser || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const draw = () => {
            requestAnimationFrame(draw)

            analyser.getByteFrequencyData(dataArray)

            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const barWidth = (canvas.width / bufferLength) * 2.5
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height

                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
                gradient.addColorStop(0, '#8B5CF6')
                gradient.addColorStop(1, '#EC4899')

                ctx.fillStyle = gradient
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

                x += barWidth + 1
            }
        }

        draw()
    }, [analyser])

    return (
        <motion.canvas
            ref={canvasRef}
            width={300}
            height={100}
            className="w-full h-24 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        />
    )
}
import { useState, useEffect } from 'react'
import Box from './components/Box'
import './App.css'

const PALETTE = [
  '#aa3bff', '#e91ee0', '#dc143c', '#f4d90c',
  '#f2711c', '#3b6fd6', '#33d6e6', '#a4e438', '#2ecc71',
]

const DEFAULT_COLOR = '#3f9986'
const GRID_ROWS = 3
const GRID_COLS = 3
const GRID_SIZE = GRID_ROWS * GRID_COLS
const PREVIEW_ON_MS = 600
const PREVIEW_GAP_MS = 200

function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function createSequence() {
  return shuffle([...Array(GRID_SIZE).keys()])
}

function App() {
  const [sequence, setSequence] = useState(createSequence)
  const [step, setStep] = useState(0)
  const [boxColors, setBoxColors] = useState(
    Array(GRID_SIZE).fill(DEFAULT_COLOR)
  )
  const [message, setMessage] = useState('Watch the order...')
  const [displayPalette, setDisplayPalette] = useState(() => shuffle(PALETTE))
  const [phase, setPhase] = useState('previewing')
  useEffect(() => {
    let cancelled = false
    setPhase('previewing')
    setMessage('Watch the order...')
    setBoxColors(Array(GRID_SIZE).fill(DEFAULT_COLOR))
    setDisplayPalette(shuffle(PALETTE))

    const showStep = (i) => {
      if (cancelled) return

      if (i === GRID_SIZE) {
        setBoxColors(Array(GRID_SIZE).fill(DEFAULT_COLOR))
        setStep(0)
        setPhase('ready')
        setMessage('Now click the boxes in that order.')
        return
      }

      const boxIndex = sequence[i]

      setBoxColors((prev) => {
        const next = [...prev]
        next[boxIndex] = PALETTE[i]
        return next
      })

      setTimeout(() => {
        if (cancelled) return
        setBoxColors((prev) => {
          const next = [...prev]
          next[boxIndex] = DEFAULT_COLOR
          return next
        })
        setTimeout(() => showStep(i + 1), PREVIEW_GAP_MS)
      }, PREVIEW_ON_MS)
    }

    showStep(0)

    return () => {
      cancelled = true
    }
  }, [sequence])

  const resetProgress = () => {
    setStep(0)
    setBoxColors(Array(GRID_SIZE).fill(DEFAULT_COLOR))
  }

  const startNewRound = () => {
    setSequence(createSequence())
  }

  const handleBoxClick = (index) => {
    if (phase !== 'ready') return

    const expectedIndex = sequence[step]
    if (index !== expectedIndex) {
      setMessage('Wrong box — starting over!')
      resetProgress()
      return
    }

    const nextColors = [...boxColors]
    nextColors[index] = PALETTE[step]
    setBoxColors(nextColors)

    const nextStep = step + 1
    setStep(nextStep)

    if (nextStep === GRID_SIZE) {
      setMessage('You matched the whole sequence! Jumbling a new one...')
      setTimeout(startNewRound, 1200)
    } else {
      setMessage(`Correct! ${GRID_SIZE - nextStep} to go.`)
    }
  }

  return (
    <>
      <div className="palette">
        {displayPalette.map((color, index) => (
          <Box key={index} color={color} />
        ))}
      </div>

      <p className="status">{message}</p>

      <div className={`grid${phase === 'previewing' ? ' grid--locked' : ''}`}>
        {boxColors.map((color, index) => (
          <Box
            key={index}
            color={color}
            onClick={() => handleBoxClick(index)}
          />
        ))}
      </div>
    </>
  )
}

export default App
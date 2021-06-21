import { useCallback, useState, useRef } from 'react';
import produce from 'immer'

import './App.css'

const numRows = 25;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
]

const generateEmptyGrid = () => {
  const rows = []
  for (let i=0; i < numRows; i++) {
    rows.push(Array.from({length: numCols}).fill(0))
  }

  return rows
}

function App() {
  const [grid, setGrid] = useState(generateEmptyGrid)

  const [running, setRunning] = useState(false)

  const runningRef = useRef(running)
  runningRef.current = running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return
    
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i=0; i < numRows; i++) {
          for (let k=0; k < numCols; k++) {
            let neighbors = 0
            operations.forEach(([x, y]) => {
              const newI = i + x
              const newK = k + y
              if (newI >= 0 && newI < numRows && newK < numCols) {
                neighbors += g[newI][newK]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1
            } 
          }
        }
      })
    })
    
    setTimeout(runSimulation, 100)
  }, [])

  return (
    <div style={styles.content}>

      <h1 className='title'>Game of Life</h1>

      <div style={{display: 'flex', justifySelf: 'center', justifyContent: 'space-around', padding: '1em 30vw'}} >
      <button onClick={() => {
        setRunning(!running)
        if (!running) {
          runningRef.current = true
          runSimulation()
        }}}>{running ? 'stop' : 'start'}</button>
      <button onClick={() => setGrid(generateEmptyGrid())}>clear</button>
      <button onClick={() => {
        const rows = []
        for (let i=0; i < numRows; i++) {
          rows.push(
            Array.from({length: numCols}, () => (Math.random() > 0.8 ? 1 : 0))
          )
        }
      
        setGrid(rows)
      }}>random</button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 30px)`,
        justifyContent: 'center',
      }}> 
        {grid.map((rows, i) => rows.map((col, k) => 
          <div 
          key={`${i}-${k}`}
          style={{
            width: 30, 
            height: 30, 
            backgroundColor: grid[i][k] ? '#9fef00' : undefined,
            border: "solid 1.5px #a4b1cd",
          }}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][k] = gridCopy[i][k] ? 0 : 1
            })
            setGrid(newGrid)
          }} />  
        ))}
      </div>
    </div>
  );
}

const styles = {
  content: {
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#141d2b',
    // height: '100vh',
    // width: '100vw',
  },
}

export default App;
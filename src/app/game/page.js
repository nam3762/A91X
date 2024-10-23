'use client';

import { useState, useEffect } from 'react';
import BeamLine from '../components/BeamLine';
import useKeyControls from '../hooks/useKeyControls';
import styles from './game.module.css';

export default function Game() {
  const [lines, setLines] = useState([]);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState(0);
  const [animatedLines, setAnimatedLines] = useState(0);
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  });

  const resetCanvas = () => {
    setLines([]);
    generateLines();
  };

  const { speed, interval, linesPerTick, handleKeyPress, setSpeed, setIntervalValue, setLinesPerTick } =
    useKeyControls(resetCanvas);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    if (lines.length === 0) {
      generateLines();
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [lines]);

  useEffect(() => {
    if (animatedLines < displayedLines) {
      const updateAnimatedLines = () => {
        setAnimatedLines((prev) => prev + 1);
      };
      const animationInterval = setInterval(
        updateAnimatedLines,
        (currentTimer / 10 ?? 30) / linesPerTick
      );
      return () => clearInterval(animationInterval);
    }
  }, [animatedLines, displayedLines]);

  let currentTimer;
  useEffect(() => {
    if (animationIndex < lines.length) {
      const timer = setTimeout(() => {
        setAnimationIndex((prevIndex) => prevIndex + linesPerTick);
        setDisplayedLines((prev) => prev + linesPerTick);
      }, interval);
      currentTimer = interval;
      return () => clearTimeout(timer);
    }
  }, [animationIndex, lines, interval, linesPerTick]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [handleKeyPress]);

  const generateLines = () => {
    const lineCount = 1000;
    const newLines = [];

    const getRandomEdgePoint = (excludeEdge = null) => {
      const edges = ['top', 'bottom', 'left', 'right'];
      const availableEdges = excludeEdge ? edges.filter((edge) => edge !== excludeEdge) : edges;
      const edge = availableEdges[Math.floor(Math.random() * availableEdges.length)];

      switch (edge) {
        case 'top':
          return { x: Math.random() * canvasSize.width, y: 0, edge: 'top' };
        case 'bottom':
          return { x: Math.random() * canvasSize.width, y: canvasSize.height, edge: 'bottom' };
        case 'left':
          return { x: 0, y: Math.random() * canvasSize.height, edge: 'left' };
        case 'right':
          return { x: canvasSize.width, y: Math.random() * canvasSize.height, edge: 'right' };
        default:
          return { x: 0, y: 0, edge: 'top' };
      }
    };

    for (let i = 0; i < lineCount; i++) {
      const startPoint = getRandomEdgePoint();
      const endPoint = getRandomEdgePoint(startPoint.edge);

      const colors = ['#FF3D00', '#00E676', '#2979FF', '#FFEA00', '#D500F9'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      newLines.push({
        id: i,
        startX: startPoint.x,
        startY: startPoint.y,
        endX: endPoint.x,
        endY: endPoint.y,
        color,
      });
    }

    setLines(newLines);
    setAnimationIndex(0);
    setDisplayedLines(0);
    setAnimatedLines(0);
  };

  const resetAll = () => {
    resetCanvas();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rapid Beam Booster</h1>
      <div className={styles.info}>
        <p>Number of Lines: {animatedLines}</p>
        <p>Speed: {speed.toFixed(2)}</p>
        <p>Time Interval: {interval} ms</p>
        <p>Generated Lines per Time: {linesPerTick}</p>

        <div className={styles.buttonGroup}>
          <div>
            <p className='text-sm'>Speed</p>
            <button className='px-4' onClick={() => setSpeed((prev) => Math.max(0.05, prev - 0.05))}>+</button>
            <button className='px-4' onClick={() => setSpeed((prev) => prev + 0.05)}>-</button>
          </div>
          <div>
            <p className='text-sm'>Time</p>
            <button className='px-4' onClick={() => setIntervalValue((prev) => Math.max(10, prev - 10))}>+</button>
            <button className='px-4' onClick={() => setIntervalValue((prev) => prev + 10)}>-</button>
          </div>
          <div className={styles.lineButtons}>
            {[...Array(10).keys()].map((num) => (
              <button className='px-2 text-sm' key={num} onClick={() => setLinesPerTick(num)}>
                {num}
              </button>
            ))}
          </div>
          <button className='my-8' onClick={resetAll}>Reset</button>
        </div>


      </div>

      <div className={styles.canvas} style={{ width: canvasSize.width, height: canvasSize.height }}>
        {lines.slice(0, displayedLines).map((line) => (
          <BeamLine
            key={line.id}
            startX={line.startX}
            startY={line.startY}
            endX={line.endX}
            endY={line.endY}
            color={line.color}
            speed={speed}
          />
        ))}
      </div>
    </div>
  );
}

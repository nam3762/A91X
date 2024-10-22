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
    width: 0, // 초기값을 0으로 설정
    height: 0,
  });

  // 리셋 함수 정의
  const resetCanvas = () => {
    setLines([]);
    generateLines();
  };

  const { speed, interval, linesPerTick, handleKeyPress } = useKeyControls(resetCanvas);

  // 창 크기에 맞게 canvas 크기 조정
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 클라이언트에서만 이벤트 리스너 추가
    if (typeof window !== 'undefined') {
      handleResize(); // 초기 크기 설정
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

  // 동시 생성된 선 개수를 빠르게 1씩 증가시키기 위한 애니메이션
  useEffect(() => {
    if (animatedLines < displayedLines) {
      const updateAnimatedLines = () => {
        setAnimatedLines((prev) => prev + 1); // 1씩 빠르게 증가
      };
      const animationInterval = setInterval(updateAnimatedLines, (currentTimer / 10 ?? 30) / linesPerTick); // 30ms마다 1씩 증가
      return () => clearInterval(animationInterval);
    }
  }, [animatedLines, displayedLines]);

  let currentTimer;
  // 선을 그리는 로직
  useEffect(() => {
    if (animationIndex < lines.length) {
      const timer = setTimeout(() => {
        setAnimationIndex((prevIndex) => prevIndex + linesPerTick); // 동시에 n개의 선 생성
        setDisplayedLines((prev) => prev + linesPerTick); // 즉시 표시되는 선의 개수는 n개씩 증가
      }, interval);
      currentTimer = interval;
      return () => clearTimeout(timer);
    }
  }, [animationIndex, lines, interval, linesPerTick]);

  // 키보드 입력 처리
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
      const availableEdges = excludeEdge ? edges.filter(edge => edge !== excludeEdge) : edges;
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
          return { x: 0, y: 0, edge: 'top' }; // fallback
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
    setDisplayedLines(0); // 리셋 시 즉시 그려지는 선 개수 초기화
    setAnimatedLines(0);  // 리셋 시 사용자에게 보여줄 선 개수도 초기화
  };

  const resetAll = () => {
    resetCanvas();
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rapid Beam Booster</h1>
      <div className={styles.info}>
        <p>Number of Lines: {animatedLines}</p> {/* 사용자가 보는 선 개수 (빠르게 증가) */}
        <p>Speed: {speed.toFixed(2)}</p>
        <p>Time Interval: {interval} ms</p>
        <p>Generated Lines per Time: {linesPerTick}</p>
        <button className={styles.resetButton} onClick={resetAll}>Reset</button>
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
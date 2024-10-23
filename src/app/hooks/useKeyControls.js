import { useState } from 'react';

const MIN_INTERVAL = 10;

export default function useKeyControls(resetCanvas) {
  const [speed, setSpeed] = useState(0.5);
  const [interval, setIntervalValue] = useState(500);
  const [linesPerTick, setLinesPerTick] = useState(1);

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'a': // 속도 감소
        setSpeed((prevSpeed) => prevSpeed + 0.05);
        break;
      case 's': // 속도 증가
        setSpeed((prevSpeed) => Math.max(0.05, prevSpeed - 0.05));
        break;
      case 'l': // time interval 감소
        setIntervalValue((prevInterval) => Math.max(MIN_INTERVAL, prevInterval + 10)); // 음수 방지
        break;
      case ';': // time interval 증가
        setIntervalValue((prevInterval) => Math.max(MIN_INTERVAL, prevInterval - 10)); // 최소값 적용
        break;
      case 'r': // 리셋
        if (resetCanvas) resetCanvas(); // 리셋 함수 호출
        break;
      case '0':
      case '1': // 1개의 선 생성
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9': // 숫자 키에 따른 생성되는 선의 개수
        setLinesPerTick(Number(e.key));
        break;
      default:
        break;
    }
  };

  // setter 함수들도 반환
  return { speed, interval, linesPerTick, handleKeyPress, setSpeed, setIntervalValue, setLinesPerTick };
}

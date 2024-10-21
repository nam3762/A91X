// app/components/BeamLine.js
'use client';

import { motion } from 'framer-motion';
import styles from './BeamLine.module.css';


export default function BeamLine({ startX, startY, endX, endY, color, speed }) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const length = Math.hypot(deltaX, deltaY);

  const angle = Math.atan2(deltaY, deltaX);

  return (
    <motion.div
      className={styles.line}
      initial={{ width: 0 }}
      animate={{ width: length }}
      transition={{ duration: speed }}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        transform: `rotate(${angle}rad)`,
        left: `${startX}px`,
        top: `${startY}px`,
      }}
    ></motion.div>
  );
}

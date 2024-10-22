// app/page.js
'use client';

import styles from './page.module.css';
import Game from './game/page';
import { useState } from 'react';
export default function Home() {

  const [entry, setEntry] = useState(false);

  function handleEntry() {
    setEntry((prev) => !prev);
  }
 
  return (
    <div className={styles.container}>
      {entry ? <Game /> : <button className={styles.startButton} onClick={handleEntry}>Start</button>}
    </div>
  );
}
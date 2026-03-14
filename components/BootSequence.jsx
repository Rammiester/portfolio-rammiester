import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const bootText = [
  "BIOS Date 03/14/26 09:50:13 Ver 08.00.15",
  "CPU: Intel(R) Core(TM) i9-14900K CPU @ 3.20GHz",
  "Speed: 3.20 GHz",
  "Press DEL to run Setup",
  "Press F8 for BBS POPUP",
  "Initializing USB Controllers .. Done.",
  "65536MB OK",
  "",
  "Auto-Detecting Pri Master.. IDE Hard Disk",
  "Auto-Detecting Pri Slave... Not Detected",
  "Pri Master: 3.M.123456 WDC WD5000AAKX-001CA0",
  "Ultra DMA Mode-6, S.M.A.R.T. Capable and Status OK",
  "",
  "Loading OS...",
  "Initializing Portfolio Environment...",
  "Mounting Modules: [XP, DEV, CREATIVE]... OK",
  "Starting UI Subsystem... OK",
  "Boot sequence complete."
];

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootText.length) {
        setLines(prev => [...prev, bootText[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 100); // Fast boot

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-white font-mono p-4 z-[9999] overflow-hidden text-sm md:text-base">
      <div className="flex flex-col gap-1">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            {line || <br/>}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          className="w-2 h-4 bg-white mt-1"
        />
      </div>
    </div>
  );
}

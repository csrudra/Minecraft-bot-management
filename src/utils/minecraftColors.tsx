import React from 'react';

const COLOR_MAP: Record<string, string> = {
  '0': '#000000',
  '1': '#0000aa',
  '2': '#00aa00',
  '3': '#00aaaa',
  '4': '#aa0000',
  '5': '#aa00aa',
  '6': '#ffaa00',
  '7': '#aaaaaa',
  '8': '#555555',
  '9': '#5555ff',
  'a': '#55ff55',
  'b': '#55ffff',
  'c': '#ff5555',
  'd': '#ff55ff',
  'e': '#ffff55',
  'f': '#ffffff',
};

export function renderMinecraftText(text: string): React.ReactNode {
  if (!text) return null;
  if (!text.includes('§')) {
    return <span>{text}</span>;
  }

  const parts = text.split(/(§[0-9a-fk-or])/gi);
  let currentColor = '#ffffff';
  let isBold = false;
  let isItalic = false;

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('§')) {
          const code = part.charAt(1).toLowerCase();
          if (COLOR_MAP[code]) {
            currentColor = COLOR_MAP[code];
            isBold = false;
            isItalic = false;
          } else if (code === 'l') {
            isBold = true;
          } else if (code === 'o') {
            isItalic = true;
          } else if (code === 'r') {
            currentColor = '#ffffff';
            isBold = false;
            isItalic = false;
          }
          return null;
        }

        if (!part) return null;

        return (
          <span
            key={index}
            style={{
              color: currentColor,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
            }}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}

export function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function getPingColor(ping: number): string {
  if (ping <= 45) return 'text-emerald-400';
  if (ping <= 100) return 'text-amber-400';
  return 'text-rose-400';
}

export function getHealthColor(health: number, maxHealth: number = 20): string {
  const pct = (health / maxHealth) * 100;
  if (pct > 65) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
  if (pct > 30) return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
  return 'text-rose-400 bg-rose-500/20 border-rose-500/40';
}

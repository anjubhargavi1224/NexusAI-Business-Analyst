import React from 'react';
import robotImg from '../assets/nexus_robot.png';

export const NexusMascot = ({ 
  size = 'md', 
  animated = true, 
  glow = true, 
  className = '', 
  style = {} 
}) => {
  const sizeMap = {
    sm: { width: '64px', height: '64px', glowSize: '70px' },
    md: { width: '160px', height: '160px', glowSize: '180px' },
    lg: { width: '340px', height: '340px', glowSize: '360px' },
    xl: { width: '420px', height: '420px', glowSize: '450px' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div 
      className={`nexus-mascot-container ${animated ? 'animate-robot-float' : ''} ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: dim.width,
        height: dim.height,
        ...style
      }}
    >
      {/* Subtle Purple Glow Aura */}
      {glow && (
        <div 
          className="animate-pulse-glow"
          style={{
            position: 'absolute',
            width: dim.glowSize,
            height: dim.glowSize,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(126, 62, 172, 0.35) 0%, rgba(92, 46, 126, 0.12) 50%, transparent 75%)',
            filter: 'blur(16px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* 3D Robot Image */}
      <img
        src={robotImg}
        alt="NEXUS AI Assistant Mascot"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 12px 28px rgba(92, 46, 126, 0.35))'
        }}
        loading="eager"
      />
    </div>
  );
};

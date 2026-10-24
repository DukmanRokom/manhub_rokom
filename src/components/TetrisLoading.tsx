import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export interface TetrisLoadingProps {
  /**
   * Status text or title for loading state (default: 'Sinkronisasi Database...')
   */
  title?: string;
  /**
   * Subtitle text providing context for the synchronization
   */
  subtitle?: string;
  /**
   * Visual size: 'sm' (compact), 'md' (default content section), 'lg' (large)
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Minimum height of container
   */
  minHeight?: number | string;
  /**
   * If true, renders a clean transparent backdrop suitable for overlays
   */
  overlay?: boolean;
}

/**
 * Tetris Loading Animation - Varian 2: Corporate Gov-Tech
 * Harmonious palette of emerald & teal official Biro Kominfo & Kemenkes RI.
 * Adapted from Stitch Project ID: 9047563583184087908 / Screen: d3f7e83a6a2942408c8b238d2791fcb0
 */
export default function TetrisLoading({
  title = 'Sinkronisasi Database...',
  subtitle = 'Menyelaraskan data lembar kerja dengan Google Sheets Biro Kominfo',
  size = 'md',
  minHeight,
  overlay = false,
}: TetrisLoadingProps) {
  // Scaling configuration based on size
  const scale = size === 'sm' ? 0.8 : size === 'lg' ? 1.2 : 1;
  const cellSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const stageWidth = size === 'sm' ? 220 : size === 'lg' ? 320 : 270;
  const stageHeight = size === 'sm' ? 120 : size === 'lg' ? 170 : 140;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: minHeight || (size === 'sm' ? 180 : 260),
        py: size === 'sm' ? 2 : 4,
        px: 2,
        position: overlay ? 'absolute' : 'relative',
        top: overlay ? 0 : 'auto',
        left: overlay ? 0 : 'auto',
        right: overlay ? 0 : 'auto',
        bottom: overlay ? 0 : 'auto',
        zIndex: overlay ? 10 : 1,
        backgroundColor: overlay ? 'rgba(255, 255, 255, 0.88)' : 'transparent',
        backdropFilter: overlay ? 'blur(4px)' : 'none',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: size === 'sm' ? 380 : 460,
          borderRadius: 5,
          p: size === 'sm' ? 2.5 : 3.5,
          background: 'linear-gradient(165deg, #091e1d 0%, #031413 100%)',
          border: '1px solid rgba(45, 212, 191, 0.28)',
          boxShadow: '0 20px 40px -15px rgba(0, 107, 99, 0.35), 0 0 0 1px rgba(20, 184, 166, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Subtle Ambient Glow Behind Stage */}
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 240,
            height: 140,
            background: 'radial-gradient(ellipse at center, rgba(45, 212, 191, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Header Label Badge (Corporate Gov-Tech / Varian 2) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.4,
              borderRadius: '20px',
              backgroundColor: 'rgba(20, 184, 166, 0.12)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#2dd4bf',
                boxShadow: '0 0 8px #2dd4bf',
                animation: 'tetrisPulseGlow 2s infinite',
              }}
            />
            <Typography
              sx={{
                color: '#5eead4',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}
            >
              Corporate Gov-Tech • Syncing
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#14b8a6',
              fontWeight: 600,
              fontFamily: 'monospace',
              opacity: 0.9,
            }}
          >
            MANHUB RO-KOM
          </Typography>
        </Box>

        {/* Micro Stage (Variant 2 Stage Container) */}
        <Box
          sx={{
            width: stageWidth,
            height: stageHeight,
            backgroundColor: 'rgba(4, 26, 24, 0.75)',
            borderRadius: 3.5,
            border: '1px solid rgba(20, 184, 166, 0.3)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pb: 1.5,
            backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.22) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        >
          {/* Ambient Sparkles */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 16,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#5eead4',
              boxShadow: '0 0 6px #5eead4',
              opacity: 0.7,
              animation: 'tetrisPulseGlow 2.4s infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 22,
              right: 18,
              width: 3,
              height: 3,
              borderRadius: '50%',
              backgroundColor: '#34d399',
              boxShadow: '0 0 6px #34d399',
              opacity: 0.6,
              animation: 'tetrisPulseGlow 3s infinite',
            }}
          />

          {/* Ghost dashed outline for target row */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 14,
              right: 14,
              height: cellSize * 2 + 4,
              border: '1.5px dashed rgba(45, 212, 191, 0.22)',
              borderRadius: 1.5,
              pointerEvents: 'none',
            }}
          />

          {/* Tetromino Stage Falling Elements */}
          <Box
            sx={{
              position: 'relative',
              width: cellSize * 9,
              height: cellSize * 4.5,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {/* Piece 1: anim-tetris-1 (Left Column - Teal 600 / Teal 500) */}
            <Box
              className="anim-tetris-1"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#14b8a6', // Teal 500
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#0d9488', // Teal 600
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
            </Box>

            {/* Piece 2: anim-tetris-2 (Center 2x2 Square - Teal 400 & Emerald 400) */}
            <Box
              className="anim-tetris-2"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: cellSize * 2 + 2,
                display: 'grid',
                gridTemplateColumns: `repeat(2, ${cellSize}px)`,
              }}
            >
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#2dd4bf', // Teal 400
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              />
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#34d399', // Emerald 400
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              />
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#2dd4bf', // Teal 400
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              />
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#34d399', // Emerald 400
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              />
            </Box>

            {/* Piece 3: anim-tetris-3 (Right L/T shape - Teal 300 & Emerald 300) */}
            <Box
              className="anim-tetris-3"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <Box
                className="tetris-cell-sm"
                sx={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: '#5eead4', // Teal 300
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <Box sx={{ display: 'flex' }}>
                <Box
                  className="tetris-cell-sm"
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: '#5eead4', // Teal 300
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                <Box
                  className="tetris-cell-sm"
                  sx={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: '#6ee7b7', // Emerald 300
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              </Box>
            </Box>

            {/* Flash Light when full line clears */}
            <Box
              className="anim-clear-flash"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: cellSize,
                background: 'linear-gradient(90deg, rgba(94, 234, 212, 0.95), rgba(255, 255, 255, 0.98), rgba(110, 231, 183, 0.95))',
                borderRadius: '3px',
                boxShadow: '0 0 16px #2dd4bf',
                pointerEvents: 'none',
              }}
            />
          </Box>
        </Box>

        {/* Loading Status Caption */}
        <Box sx={{ mt: 2.5, textAlign: 'center', width: '100%' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#2dd4bf',
                boxShadow: '0 0 8px #2dd4bf',
                animation: 'tetrisPulseGlow 1.8s infinite',
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.3px',
                fontSize: size === 'sm' ? '0.8rem' : '0.92rem',
              }}
            >
              {title}
            </Typography>
          </Box>

          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#94a3b8',
                fontSize: size === 'sm' ? '0.7rem' : '0.76rem',
                maxWidth: 320,
                mx: 'auto',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Fluid Progress Bar */}
          <Box
            sx={{
              width: size === 'sm' ? 140 : 200,
              height: 4,
              backgroundColor: 'rgba(15, 118, 110, 0.35)',
              borderRadius: '999px',
              overflow: 'hidden',
              mx: 'auto',
              mt: 2,
            }}
          >
            <Box
              className="anim-progress-pulse"
              sx={{
                height: '100%',
                background: 'linear-gradient(90deg, #14b8a6, #2dd4bf, #34d399)',
                borderRadius: '999px',
                boxShadow: '0 0 8px rgba(45, 212, 191, 0.6)',
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

/**
 * Convenient TableRow wrapper for tables when loading data
 */
export function TetrisLoadingTableRow({
  colSpan = 7,
  title,
  subtitle,
  size = 'md',
}: TetrisLoadingProps & { colSpan?: number }) {
  return (
    <tr style={{ border: 0 }}>
      <td
        colSpan={colSpan}
        style={{
          padding: '32px 16px',
          textAlign: 'center',
          border: 0,
        }}
      >
        <TetrisLoading title={title} subtitle={subtitle} size={size} />
      </td>
    </tr>
  );
}

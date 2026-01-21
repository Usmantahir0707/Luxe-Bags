import { useEffect, useRef } from 'react';

/**
 * Custom hook for simple balloon animation
 * Creates a simple blinking effect at a fixed position
 * 
 * @param {Object} options - Animation configuration
 * @param {number} options.blinkDuration - Time for blink cycle (ms)
 * @param {number} options.maxScale - Maximum scale during blink
 * @param {string} options.className - Additional CSS classes
 * @returns {Object} Animation controls and ref
 */
export const useBalloonAnimation = (options = {}) => {
  const {
    blinkDuration = 1000,
    maxScale = 1.2,
    className = ''
  } = options;

  const balloonRef = useRef(null);

  useEffect(() => {
    const ref = balloonRef.current;
    if (!ref) return;

    // Set initial fixed position and scale
    ref.style.transition = `all ${blinkDuration}ms ease-in-out`;
    ref.style.transform = `scale(1)`;
    ref.style.opacity = '1';

    // Generate random stagger delay for this balloon (much longer range)
    const staggerDelay = Math.random() * blinkDuration * 5;

    // Generate random position offset for this balloon
    const positionOffsetX = (Math.random() - 0.5) * 20;
    const positionOffsetY = (Math.random() - 0.5) * 20;

    // Generate random timing offsets for opacity and scale
    const opacityOffset = Math.random() * blinkDuration;
    const scaleOffset = Math.random() * blinkDuration;

    // Set up blinking animation with stagger
    const interval = setInterval(() => {
      // Randomize timing for opacity change
      setTimeout(() => {
        ref.style.opacity = '0';
      }, opacityOffset);

      // Randomize timing for scale and position change
      setTimeout(() => {
        ref.style.transform = `scale(${maxScale}) translate(${positionOffsetX}px, ${positionOffsetY}px)`;
      }, scaleOffset);
      
      setTimeout(() => {
        // Randomize timing for opacity return
        setTimeout(() => {
          ref.style.opacity = '1';
        }, opacityOffset);

        // Randomize timing for scale and position return
        const newX = (Math.random() - 0.5) * 20;
        const newY = (Math.random() - 0.5) * 20;
        setTimeout(() => {
          ref.style.transform = `scale(1) translate(${newX}px, ${newY}px)`;
        }, scaleOffset);
      }, blinkDuration);
    }, blinkDuration * 3);

    // Apply initial stagger delay
    setTimeout(() => {
      // Randomize timing for initial opacity change
      setTimeout(() => {
        ref.style.opacity = '0';
      }, opacityOffset);

      // Randomize timing for initial scale and position change
      setTimeout(() => {
        ref.style.transform = `scale(${maxScale}) translate(${positionOffsetX}px, ${positionOffsetY}px)`;
      }, scaleOffset);
      
      setTimeout(() => {
        // Randomize timing for initial opacity return
        setTimeout(() => {
          ref.style.opacity = '1';
        }, opacityOffset);

        // Randomize timing for initial scale and position return
        const newX = (Math.random() - 0.5) * 20;
        const newY = (Math.random() - 0.5) * 20;
        setTimeout(() => {
          ref.style.transform = `scale(1) translate(${newX}px, ${newY}px)`;
        }, scaleOffset);
      }, blinkDuration);
    }, staggerDelay);

    return () => {
      clearInterval(interval);
    };
  }, [blinkDuration, maxScale]);

  return {
    balloonRef
  };
};

/**
 * Balloon component wrapper
 * Wraps any element with simple blinking animation and theme-colored shadows
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Element to animate
 * @param {Object} props.options - Animation configuration (same as useBalloonAnimation)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Animated balloon element with theme-colored shadows
 */
export const Balloon = ({ 
  children, 
  options = {}, 
  className = '',
  ...props 
}) => {
  const { balloonRef } = useBalloonAnimation({ ...options, className });

  return (
    <span
      ref={balloonRef}
      className={`balloon ${className}`}
      style={{
        display: 'inline-block',
        position: 'absolute', // Allow positioning
        willChange: 'transform, opacity',
        zIndex: -1, // Very low z-index to stay behind all other components
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.3), 0 0 4px rgba(0, 0, 0, 0.4), 0 0 2px rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        backdropFilter: 'blur(4px)',
        ...props.style
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default useBalloonAnimation;

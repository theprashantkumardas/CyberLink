import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // The characters to drop
    const chars = '01CYBERLINK01XYZ'; 
    const fontSize = 14;
    
    // Calculate how many columns of text fit across the screen
    const columns = canvas.width / fontSize;
    
    // An array to track the Y position of each drop
    // drops[0] = 10 means the first column's drop is at y=10
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      // 1. Fade the previous frame slightly (creates the trail effect)
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Set font color to neon green
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      // 3. Loop through drops and draw characters
      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw it
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 4. Reset drop to top randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
      }
    };

    // Run the animation every 33ms (approx 30fps)
    const interval = setInterval(draw, 33);

    // Cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);

  // Return the canvas element
  // 'fixed top-0 left-0' keeps it stuck to the background
  // '-z-10' puts it BEHIND everything else
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-20" 
    />
  );
};

export default MatrixRain;
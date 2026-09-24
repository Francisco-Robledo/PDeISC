import confetti from 'canvas-confetti';
import { useCallback } from 'react';

export function useConfetti() {
  const triggerGoogleConfetti = useCallback(() => {
    // Google 4-color palette
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: colors,
      disableForReducedMotion: true
    });
  }, []);

  const triggerAchievementBurst = useCallback(() => {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#A142F4'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  return { triggerGoogleConfetti, triggerAchievementBurst };
}

import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to handle showing entry zone explanations on mobile devices
 * when users tap the info icon.
 */
export const useEntryZoneExplanation = () => {
  useEffect(() => {
    const handleShowExplanation = (event: CustomEvent) => {
      const { explanation } = event.detail;
      if (explanation) {
        toast({
          title: "Entry Zone Explanation",
          description: explanation,
          duration: 5000, // 5 seconds
        });
      }
    };

    // Add event listener
    document.addEventListener(
      'show-entry-zone-explanation',
      handleShowExplanation as EventListener
    );

    // Clean up the event listener
    return () => {
      document.removeEventListener(
        'show-entry-zone-explanation',
        handleShowExplanation as EventListener
      );
    };
  }, []);
};

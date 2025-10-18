
import { useState, useEffect } from 'react';

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export const usePasswordStrength = (password: string): PasswordStrength => {
  const [strength, setStrength] = useState<PasswordStrength>(0);

  useEffect(() => {
    let score: PasswordStrength = 0;
    if (!password) {
      setStrength(0);
      return;
    }

    // Add points for length
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Add points for character types
    const checks = [
      /\d/,           // has numbers
      /[a-z]/,        // has lowercase
      /[A-Z]/,        // has uppercase
      /[^a-zA-Z0-9]/, // has symbols
    ];

    let passedChecks = 0;
    checks.forEach(regex => {
      if (regex.test(password)) {
        passedChecks++;
      }
    });

    if (passedChecks >= 3) score++;
    if (passedChecks >= 4) score++;

    setStrength(Math.min(score, 4) as PasswordStrength);

  }, [password]);

  return strength;
};

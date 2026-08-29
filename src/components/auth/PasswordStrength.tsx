import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const getLabel = () => {
    switch (score) {
      case 1:
        return { text: 'Weak', color: 'bg-rose-500', textCol: 'text-rose-400' };
      case 2:
        return { text: 'Moderate', color: 'bg-amber-500', textCol: 'text-amber-400' };
      case 3:
        return { text: 'Strong', color: 'bg-cyan-500', textCol: 'text-cyan-400' };
      case 4:
        return { text: 'Quantum Fortress', color: 'bg-emerald-500', textCol: 'text-emerald-400' };
      default:
        return { text: 'Too Short', color: 'bg-slate-600', textCol: 'text-slate-400' };
    }
  };

  const status = getLabel();

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-400">Entropy Security</span>
        <span className={`font-mono font-bold ${status.textCol}`}>{status.text}</span>
      </div>
      <div className="grid grid-cols-4 gap-1 h-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full rounded-full transition-colors duration-300 ${
              score >= level ? status.color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

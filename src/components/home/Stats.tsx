import React from 'react';
import { Shield, Clock, Users, HardHat, Award } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Stats: React.FC = () => {
  const { settings } = useSettings();

  const stats = [
    {
      value: `${settings.stats_experience_years}+`,
      label: 'Years of Engineering',
      description: 'Continuous tier-one delivery across East Africa',
      icon: Clock
    },
    {
      value: `${settings.stats_projects_completed}+`,
      label: 'Landmark Projects Completed',
      description: 'High-rises, civil structures & highways',
      icon: Award
    },
    {
      value: `${settings.stats_workforce_count.toLocaleString()}+`,
      label: 'Engineering & Construction Workforce',
      description: 'Certified engineers, project managers & craftsmen',
      icon: Users
    },
    {
      value: '6.2M+',
      label: 'Safe Man-Hours Without LTI',
      description: 'Zero-harm ISO 45001 safety record',
      icon: HardHat
    }
  ];

  return (
    <section className="bg-slate-900 border-y border-slate-800 py-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/60"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight text-white">{stat.value}</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">{stat.label}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Download, Calendar, Printer, Share2 } from 'lucide-react';

export const TimetableExport: React.FC = () => {
  const { timetable, showToast } = useTaskStore();

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(timetable, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TaskVerse_Timetable_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported timetable data (JSON)', 'success');
  };

  const handleExportICS = () => {
    // Generate valid iCalendar (.ics) format
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TaskVerse AI//Quantum Timetable//EN',
      'CALSCALE:GREGORIAN',
    ];

    timetable.forEach((ev) => {
      const dayMap: Record<string, string> = {
        Monday: 'MO',
        Tuesday: 'TU',
        Wednesday: 'WE',
        Thursday: 'TH',
        Friday: 'FR',
        Saturday: 'SA',
        Sunday: 'SU',
      };
      const dayCode = dayMap[ev.dayOfWeek] || 'MO';

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${ev.id}@taskverse.ai`,
        `SUMMARY:${ev.title}`,
        `DESCRIPTION:Category: ${ev.category} | Type: ${ev.type || 'Session'}`,
        `LOCATION:${ev.roomOrLocation || 'TaskVerse Space'}`,
        `RRULE:FREQ=WEEKLY;BYDAY=${dayCode}`,
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TaskVerse_Master_Schedule.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Downloaded .ics format for Google / Apple Calendar sync!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportICS}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        title="Download iCal (.ics) for Google/Apple Calendar"
      >
        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">Sync iCal (.ics)</span>
      </button>

      <button
        onClick={handleExportJSON}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        title="Export raw JSON"
      >
        <Download className="w-3.5 h-3.5 text-purple-400" />
        <span className="hidden sm:inline">JSON</span>
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        title="Print schedule"
      >
        <Printer className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Print</span>
      </button>
    </div>
  );
};

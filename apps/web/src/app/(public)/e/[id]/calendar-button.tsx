'use client';

/** Builds an .ics file in the browser — no account, no server round-trip, no data leaves the device. */
const stamp = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const day = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Baku', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso)).replace(/-/g, '');
const esc = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

export function CalendarButton(p: { label: string; title: string; place: string; startsAt: string; endsAt: string | null; allDay: boolean; uid: string }) {
  const download = () => {
    const end = p.endsAt ?? new Date(new Date(p.startsAt).getTime() + 2 * 3600_000).toISOString();
    const when = p.allDay ? [`DTSTART;VALUE=DATE:${day(p.startsAt)}`] : [`DTSTART:${stamp(p.startsAt)}`, `DTEND:${stamp(end)}`];
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Salaam//Baku//EN',
      'BEGIN:VEVENT',
      `UID:${p.uid}@salaam`,
      `DTSTAMP:${stamp(new Date().toISOString())}`,
      ...when,
      `SUMMARY:${esc(p.title)}`,
      `LOCATION:${esc(p.place)}`,
      `URL:${window.location.href}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'salaam-event.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  return (
    <button type="button" className="btn btn-lg" onClick={download}>
      {p.label}
    </button>
  );
}

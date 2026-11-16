'use client';

import { useEffect, useState } from 'react';
import { getIdentity, setIdentity, type DevIdentity, type DevRole } from '@/lib/api';

/** DEV-ONLY: pick who you are acting as. Replaced by real sign-in after spike S-AUTH. */
export function IdentitySwitcher() {
  const [who, setWho] = useState<DevIdentity | null>(null);
  useEffect(() => setWho(getIdentity()), []);
  if (!who) return <div className="who" />;

  const update = (next: DevIdentity) => {
    setIdentity(next);
    setWho(next);
    window.location.reload();
  };

  return (
    <div className="who" title="Development identity — not real authentication">
      <span className="notice">dev identity</span>
      <input
        aria-label="User id"
        style={{ width: 120 }}
        defaultValue={who.id}
        onBlur={(e) => e.target.value && e.target.value !== who.id && update({ ...who, id: e.target.value })}
      />
      <select aria-label="Role" value={who.role} onChange={(e) => update({ ...who, role: e.target.value as DevRole })}>
        <option value="curator">curator</option>
        <option value="organizer">organizer</option>
        <option value="admin">admin</option>
      </select>
    </div>
  );
}

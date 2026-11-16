import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Staff workspace</h1>
      <div className="grid2">
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>
            <Link href="/review">Review queue →</Link>
          </h2>
          <p className="muted">
            Every item is checked by a person before it becomes public (D-25). Approve with a resolved place, or reject with a
            reason.
          </p>
        </div>
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>
            <Link href="/events">Events →</Link>
          </h2>
          <p className="muted">Published events, manual entry from an official source link, and cancellations.</p>
        </div>
        <div className="panel">
          <h2 style={{ marginTop: 0 }}>
            <Link href="/organizer">Organizer submission →</Link>
          </h2>
          <p className="muted">The form organizers use. Submissions land in the review queue — never directly public.</p>
        </div>
      </div>
    </main>
  );
}

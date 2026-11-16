# Founder Actions

Only things Claude genuinely cannot do. Each is asked once; status is kept here.

| ID | Action | Why | How (≈ time) | Status |
|---|---|---|---|---|
| FA-01 | Link your GitHub account to Claude | So Claude can push the code to `Ramazan-ryu/salaam` | claude.ai → Settings → Connectors → GitHub (2 min) | DONE 2026-11-17 |
| FA-02 | Revoke the GitHub token you pasted in chat | Anyone reading that chat could use it | github.com → Settings → Developer settings → Personal access tokens → delete it (2 min). Also change the GitHub password that was posted in chat on 2026-11-17 and enable 2FA | OPEN |
| FA-03 | Run the app once with Docker on your computer | Confirms the one-command start on a real Docker engine | Install Docker Desktop, open the project folder, run `docker compose --profile full up --build -d`, open http://localhost:3000 (15 min, first build) | OPTIONAL — already verified in CI on 2026-11-17 |
| FA-04 | Get the organizer terms reviewed | Needed before organizers submit in production | Lawyer reviews draft terms in docs (QL-07) | OPEN |
| FA-05 | (Optional) Connect Figma | Only if you want designs inside Figma rather than the design canvas | Connect a Figma connector in claude.ai | OPTIONAL |
| FA-06 | Decide sign-in costs if S-AUTH recommends a paid option (e.g. SMS OTP) | Claude may not create paid accounts | Claude will put the comparison and price here | WAITING (TB-06) |

# Blockers

| ID | Blocker | Impact | Workaround in place | Owner | Status |
|---|---|---|---|---|---|
| BL-01 | GitHub account not linked to Claude; push to `Ramazan-ryu/salaam` refused (403) | Code lives in local commits + delivered `.bundle`/`.zip` | Bundle delivered each session | Founder (FA-01) | RESOLVED 2026-11-17 — Claude GitHub App installed; pushed to `main` |
| BL-02 | A GitHub personal access token was pasted in chat earlier | Token may be exposed | Never used or stored by Claude | Founder (FA-02) | OPEN |
| BL-03 | This build environment cannot pull images from Docker Hub (network policy) | `docker compose up` not executed here | Compose config validated; image runtime file sets executed natively; CI job `docker-images` will build & smoke-test on GitHub | Founder runs `make up` once (FA-03), or CI after BL-01 | OPEN |
| BL-04 | Organizer terms (QL-07) not written/reviewed | DS-002 organizer portal may not be approved in production | Dev seed approves DS-002 with a "DEV SEED ONLY" note | Founder + legal (FA-04) | OPEN |
| BL-05 | Real authentication undecided (ADR-0010, spike S-AUTH) | No production deploy | DEV_AUTH header stand-in, refused in production | Claude (TB-06), founder only if paid/legal | OPEN |
| BL-06 | No Figma connector in this environment | No Figma file | Figma-compatible package planned (TB-14); design canvas in claude.ai | Founder only if Figma wanted (FA-05) | OPEN |

## Repo snapshot

- This repository contains a React frontend (Create React App) in `frontend/celpipapp` and a Flask backend in `Backend/celpipapp`.
- CI/CD is implemented with a GitHub Actions workflow at `.github/workflows/deploy.yml` which builds Docker images and updates AWS ECS services.

## High-level architecture

- Frontend: React (CRA). Entry: `frontend/celpipapp/src/index.js` and `frontend/celpipapp/src/App.js`. Local dev via `npm start`.
- Backend: Flask app at `Backend/celpipapp/app.py` that reads an Excel file (`vocalbulary_tracker.xlsx`) using pandas and exposes API endpoints under `/api/*`.
- Containerization: Each component has a `Dockerfile` under its folder (`Backend/celpipapp/Dockerfile`, `frontend/celpipapp/Dockerfile`). Images are pushed to Docker Hub and deployed to ECS via GitHub Actions.

## Primary developer workflows (how to run/build/test locally)

- Run backend locally:
  - Install dependencies: `python -m pip install -r Backend/celpipapp/requirements.txt`
  - Ensure the Excel file `vocalbulary_tracker.xlsx` is present in `Backend/celpipapp` or change path in `app.py`.
  - Run: `python Backend/celpipapp/app.py` (app listens on 0.0.0.0 in the runnable entrypoint).

- Run frontend locally:
  - `cd frontend/celpipapp && npm install && npm start`

- Build Docker images locally (same commands used by CI):
  - Backend: `docker build -t <docker-username>/celpip_app_backend:latest ./Backend/celpipapp`
  - Frontend: `docker build -t <docker-username>/celpip_app_frontend:latest ./frontend/celpipapp`

## CI/CD and deployment notes

- Workflow file: `.github/workflows/deploy.yml` — it checks out code, builds Docker images, pushes to Docker Hub, configures AWS credentials, and calls `aws ecs update-service` to force new deployments.
- Secrets required in GitHub Actions: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY_ID` (note: repo uses `AWS_SECRET_KEY_ID` — verify your secrets naming vs the AWS Actions docs). Also `AWS_REGION` is expected.

## Repo-specific patterns & gotchas for AI edits

- Excel-driven backend: The Flask app expects an Excel spreadsheet named `vocalbulary_tracker.xlsx` and a sheet called `Vocabulary tracker`. If you modify data loading, search for `vocalbulary_tracker.xlsx` and `sheet_name` in `Backend/celpipapp/app.py`.
- Typos / mismatches to watch for (these have caused issues in PRs):
  - Workflow pushes the frontend image but uses the backend tag in the `docker push` step. See `.github/workflows/deploy.yml` lines that build frontend and then `docker push rakul21/celpip_app_backend:latest` — this is likely a bug.
  - AWS secrets variable names in the workflow may not match the typical names (`AWS_SECRET_KEY_ID` vs `AWS_SECRET_ACCESS_KEY`). Verify secrets names before editing.

## When editing code, prefer small, verifiable changes

- Backend changes: Add unit/manual tests by decoupling the pandas Excel read into a helper (e.g., `Backend/celpipapp/data.py`) so it can be monkeypatched in tests.
- Frontend changes: Keep CRA scripts intact; prefer updating components in `frontend/celpipapp/src/components/*` and preserve `react-scripts` entrypoints.

## Examples of useful PRs an AI can prepare

- Fix CI bug: correct the frontend `docker push` tag in `.github/workflows/deploy.yml` and update AWS secret keys mapping.
- Make backend resilient: handle missing Excel file with a clear 500+ message and optional env var path override (e.g., `VOCAB_EXCEL_PATH`). Update `requirements.txt` if adding packages.
- Add local Docker-compose for dev: small compose file that runs backend, frontend (or serves frontend static build) and documents envs.

## Files to inspect when uncertain

- `Backend/celpipapp/app.py` — API behavior, data-loading logic, endpoints.
- `Backend/celpipapp/requirements.txt` — Python deps (flask, pandas, openpyxl, gunicorn).
- `frontend/celpipapp/package.json` — React scripts and dependencies.
- `.github/workflows/deploy.yml` — CI/CD, image names, AWS commands.
- `Backend/celpipapp/Dockerfile` and `frontend/celpipapp/Dockerfile` — container runtime expectations (ports, CMD). If Dockerfiles are missing or modified, double-check how images are built.

## Minimal safety & verification steps for PRs

- Run the Flask app locally after changes and call `/` and `/api/get_random_word` to confirm endpoints respond.
- For workflow edits, prefer a PR-only change and instruct maintainers to test by pushing a branch and checking Actions logs (don't modify production secrets).

---
If anything here is unclear or you want examples for a particular task (fix CI bug, add tests, add Docker Compose), tell me which one and I'll prepare a focused patch or PR template.

# Working together

Choose an assigned issue before starting. Read its expected result, acceptance checks, and dependencies. Keep each change small enough for another member to review.

## Branches and pull requests

- `main` contains the shared, reviewed work.
- `Samuele` is Samuele's initial setup branch, as requested.
- Use a separate branch for each later task, for example `backend/login`, `frontend/user-table`, or `infrastructure/ip-plan`.
- Start new task branches from the latest `main`. A dependent task can wait for the first pull request or clearly state its dependency.
- Open a pull request to `main`, link the issue, and describe what changed and what was checked.
- GitHub requires one approving review before merging into `main`, including for administrators. New commits dismiss previous approvals, and review conversations must be resolved.
- Force pushes and deletion of `main` are blocked. Required automated status checks will be added when the test workflow is available.

To start after cloning:

```sh
git clone https://github.com/zsaamu/cds-compulsory-assignment.git
cd cds-compulsory-assignment
git switch main
git pull --ff-only
git switch -c your-task-branch
```

Replace `your-task-branch` with a short name for your issue. Private repository access must be accepted before cloning.

## Code and comments

Keep backend, frontend, and tests in their own folders. Start with the code that solves the assignment. Add a helper or abstraction when it removes repeated work or makes an important rule easier to test.

Use plain English for names, comments, documentation, and issue updates. Comments should explain a reason, a restriction, or a decision that the code cannot show. Keep them next to the relevant code. Do not add comments that repeat each line.

Reuse the selected Satin Road functions after checking their dependencies and adapting the permissions. Do not copy marketplace features into the CDS application.

## Checks and evidence

Add focused tests for password handling, permissions, and other important behaviour. Test a forbidden request directly against the API as well as checking the interface. Report failed or unavailable checks accurately.

Each member adds documentation and evidence for their own task. Keep the combined report in the root README; supporting plans can stay in `docs/` and `infrastructure/`.

Use a separate test database. Do not commit credentials, database exports, real user details, or lab passwords. Review screenshots before uploading them. Use `.env.example` for variable names with placeholders once those variables are agreed.

## Dates and blocked tasks

Use the issue list and milestones to track progress. The daily plan is in [docs/plan.md](docs/plan.md). Work is scheduled only from Monday to Friday.

If an issue is blocked, state what is missing and which other task depends on it. Update the dates when circumstances change instead of marking unfinished work complete.

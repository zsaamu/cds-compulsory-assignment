# Reusing Satin Road

Reference: [Kyrylo-Vorona/satin-road-kas](https://github.com/Kyrylo-Vorona/satin-road-kas/tree/9b4c791cbd76abd4d20edbc2d865e6b2ab2fed68), commit `9b4c791cbd76abd4d20edbc2d865e6b2ab2fed68`, inspected on 26 October 2026.

This is a reuse plan. Application code has not been copied into the CDS repository.

| Source | Useful part | Adaptation needed |
| --- | --- | --- |
| `SatinRoad.Api/Entities/User.cs` | User fields and role | Confirm the model and allowed role values |
| `SatinRoad.Api/Controllers/UsersController.cs` | Password hasher, login, logout, current account, and user projection | Protect user endpoints; add update/delete and role checks; remove top vendors |
| `SatinRoad.Api/Program.cs` | Cookie authentication and API response behaviour | Check deployment, transport, session keys, and request protection for the chosen setup |
| `SatinRoad.Api/AppDbContext.cs` | Database connection pattern | Keep the tables needed for login and provide schema creation |
| `SatinRoad.Web/src/pages/Login.tsx` | Login form and errors | Remove the guest action and marketplace text |
| `SatinRoad.Web/src/api.ts`, `types.ts`, and session code in `App.tsx` | Requests and session restoration | Add superuser support and user management; remove marketplace requests |
| Both `Dockerfile` files, `nginx.conf`, and `compose.yaml` | Build and reverse proxy patterns | Verify runtime settings and expose the web service to the client VM |
| `SatinRoad.Api.Tests/AuthorizationTests.cs` | Test project conventions | Add tests for the new permission rules and actual request behaviour |

## Gaps already observed

- The original user listing and creation actions have no authorization restriction in that controller, and the application has no default policy that protects them.
- User update and deletion are not implemented in the original user controller.
- The frontend accepts User and Admin accounts but does not support Superuser.
- The database schema is not included in the old repository.
- Compose binds the website to `127.0.0.1:8080`; another VM cannot use that binding to reach it.

Do not copy products, categories, orders, discounts, inventory, or the related screens and tests. Record the reused paths and changes in the implementation pull requests. Do not describe a reused function as verified until it has been tested in this project.

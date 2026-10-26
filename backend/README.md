# Backend

Owner: Kyrylo.

Implementation has not started here. Add the .NET API in this folder after agreeing the first backend issue with the team.

Reuse the user model, password hasher, login/logout, and cookie session pattern from Satin Road. Add a reproducible database setup and server-side checks for all three roles. User management must check the target account's current role and any requested role change.

Document the first administrator setup, required environment variables, and verified start commands in the root README. Use test accounts and a separate database. Never return passwords or password hashes in user data.

The final application must support the permissions in the assignment; the marketplace's existing user and admin rules do not cover them.

# CDS compulsory assignment

Login and user management platform for Kvist & Bjælke ApS, with network planning and Docker deployment. This README is the combined report for **CDS.security** and **CDS.infrastructure**.

Status: the application passes local Docker, API, and browser tests. Deployment on the academy VMs and communication between VLANs are still to be verified.

## Responsibilities

| Member | GitHub | Responsibility |
| --- | --- | --- |
| Samuele | [zsaamu](https://github.com/zsaamu) | Network plan, VMs, testing, report coordination, and final review/merge |
| Kyrylo | [Kyrylo-Vorona](https://github.com/Kyrylo-Vorona) | User account storage, username/password authentication, password hashing, and role permissions |
| Azade | [azade1416](https://github.com/azade1416) | Web login, user table, and account management actions for each role |

Each member documents their own work. Samuele and Kyrylo handle Docker deployment together.

## First Admin Setup

After starting the containers below, open the database console:

```sh
docker compose exec postgres psql -U admin -d kvist_db
```

Run this query once on a fresh database to create the local test admin:

```sql
INSERT INTO "Users" ("Fullname", "Username", "PasswordHash", "Role")
VALUES ('System Admin', '@admin', '$2a$11$JkBFAUgXsNma2OWzqtTQkOXVsiHTCRpYyRQ3/YX8armgq4nmqWKbC', 'admin');
```
Log in with username `@admin` and password `password`. These are test-only credentials. Exit the database console with `\q`.

## How to Run (Setup Instructions)

Docker and Docker Compose must be installed and running. Use the latest `main` and run the following steps from the repository root.

1. Create a local `.env` file with the two required variables:

```dotenv
JWT_KEY=<generated-JWT-secret>
POSTGRES_PASSWORD=<generated-database-password>
```

Replace both placeholders with generated values. On Ubuntu, run `openssl rand -hex 32` for the JWT secret and `openssl rand -hex 24` for the database password, then copy each result into its corresponding variable. Keep `.env` local; Git ignores it.

For this Docker setup, remove any old `VITE_API_URL` setting from the build environment and local Vite environment files. The frontend uses the current server address and Nginx forwards `/api` requests to the internal backend.

2. Build and start all three services:

```sh
docker compose up --build -d --wait
docker compose ps
```

3. Create the first admin using the section above. The database starts automatically, but the admin account is created manually.

4. Open the application:

| Access | Application | Swagger |
| --- | --- | --- |
| On the server itself | `http://localhost:8000` | `http://localhost:8000/swagger` |
| From the client VM | `http://<server-IP>:8000` | `http://<server-IP>:8000/swagger` |

Replace `<server-IP>` with the server VM's assigned address. TCP port **8000** is published by Nginx; the backend is reached through Nginx inside the Docker network.
   
## Security Architecture
### Password Hashing (BCrypt)
User passwords are never saved in plain text in the database.

We use the BCrypt library (BCrypt.Net-Next) to hash passwords securely with an automatic salt.

This protects user data against database leaks and password cracking attacks.

### Authentication & Authorization (JWT)
The project uses JWT (JSON Web Tokens) for secure, stateless login.

After a successful login, the server creates a token using a secret key.

The token includes the user's ID, username, and role.

**Instant Session Control**: To keep the app secure, every protected request checks the database to verify if the user still exists and has the correct role. If an account is deleted or changed, the access updates immediately.

### How to test using Swagger UI
Send a POST request to `/api/Auth/login` using a test account's username and password.

Copy the token value from the response body.

Click the Authorize button (the lock icon) at the top right of the Swagger UI page.

Paste your token into the input field. (Note: You do not need to type the word "Bearer", just paste the token code).

Click Authorize and close the window. You can now test all protected endpoints based on your user role.

## Issues and workflow

The [agreed issues](https://github.com/zsaamu/cds-compulsory-assignment/issues) list owners, dependencies, target dates, and acceptance checks. Start with [repository setup #1](https://github.com/zsaamu/cds-compulsory-assignment/issues/1) and [lab access #2](https://github.com/zsaamu/cds-compulsory-assignment/issues/2).

Kyrylo's tasks: [account storage #3](https://github.com/zsaamu/cds-compulsory-assignment/issues/3), [authentication #4](https://github.com/zsaamu/cds-compulsory-assignment/issues/4), [permissions #6](https://github.com/zsaamu/cds-compulsory-assignment/issues/6), and [Docker #12](https://github.com/zsaamu/cds-compulsory-assignment/issues/12).

Azade's tasks: [web login #5](https://github.com/zsaamu/cds-compulsory-assignment/issues/5), [user table and management #7](https://github.com/zsaamu/cds-compulsory-assignment/issues/7), and [application checks #9](https://github.com/zsaamu/cds-compulsory-assignment/issues/9).

Changes reach `main` through pull requests reviewed, tested, and merged by Samuele.

## Work plan

| Date | Target |
| --- | --- |
| 26 October | Repository, responsibilities, and lab access |
| 27-28 October | Login, user management, and all three roles |
| 29 October | Integration and permission tests |
| 30 October | Docker, IP plan, subnetting, and network diagram |
| 2 November | VM deployment and tests between VLANs |
| 3 November | Fixes, evidence, and completed report |
| 4 November | Final review and early submission |
| 5 November | Study and contingency |

All dates are in 2026. Work is scheduled on weekdays only. The [milestones](https://github.com/zsaamu/cds-compulsory-assignment/milestones) group the tasks by target date.

## CDS.security

### Application requirements

- Web application with username/password login.
- Passwords stored with a secure password-hashing algorithm and never exposed in plaintext.
- Backend authorization for the three required roles.
- Application capable of running in Docker.

| Action | User | Superuser | Admin |
| --- | --- | --- | --- |
| Read the user table | Yes | Yes | Yes |
| Create, update, and delete ordinary user accounts | No | Yes | Yes |
| Create, update, and delete superuser or admin accounts | No | No | Yes |
| Assign or change a privileged role | No | No | Yes |

Account actions must respect these permissions. Passwords and hashes must not appear in the user table or application responses.

Technologies and frameworks are the team's choice and must be justified, particularly regarding security.

### Required documentation

The report must describe the platform, implemented security features, technology choices, and security alternatives considered, with relevant screenshots and results.

## CDS.infrastructure

### Company network plan

Cover 15 desktops, 10 laptops, 3 printers, 3 servers, 12 IP phones, 4 wireless access points, 6 cameras, network equipment, and a variable number of guest devices, allowing for growth.

- Justify the network segmentation.
- Specify private subnets, masks/CIDR, gateways, device groups, and DHCP or static addressing.
- Explain network addresses, masks, usable host counts, sizing, and growth for at least two subnets.
- Include a diagram showing Internet access, router/firewall, switches, VLANs, servers, device groups, wireless networks, and their connections.

### Lab deployment

| Machine | VLAN | Network | Operating system |
| --- | --- | --- | --- |
| Client VM | 570 | 10.5.70.0/24 | To be selected |
| Server VM | 571 | 10.5.71.0/24 | Ubuntu Server |

The login platform must run in Docker on the server and be accessible from the client VM using the server's IP and a documented TCP port from **8000 to 8100**.

The network firewall already permits TCP 8000-8100 from VLAN 570 to VLAN 571. Lab access and VM network settings are tracked in [issue #2](https://github.com/zsaamu/cds-compulsory-assignment/issues/2).

### Required evidence and explanation

Document Ubuntu Server installation, both VMs' IP configuration, Docker installation, the running container and published port, and successful use of the platform from the client VM.

Explain VLAN separation, routing between the networks, the firewall's role, and why access is limited to specific ports. Record implementation problems, their causes, fixes, and retest results.

## Final report and submission

Complete the Security and Infrastructure sections with the implemented solution, screenshots, tables, diagrams, and test results. Conclude with a short reflection on how security and infrastructure connect, deployment lessons, and changes needed for a real company.

Register the group on Moodle, confirm the assessor can access the GitHub repository, and submit through Moodle by **6 November 2026 at 23:59**. Our target submission date is **4 November**.

Source: `Compulsory-assignment.pdf`, case Kvist & Bjælke ApS, pages 2-9.

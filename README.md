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

**Draft for review.** The tables below are the proposed company design. The assignment fixes VLANs 570 and 571 and their /24 networks. VLANs 572-576, all gateway addresses, and device allocations below are design choices. Confirm the actual VM addresses, gateways, DNS, and DHCP arrangements with the teacher before configuring the academy VMs. Additional company VLANs belong to the proposed design; they are not required changes to the academy network.

The inventory contains 15 desktops, 10 laptops, 3 printers, 3 servers, 12 IP phones, 4 access points, 6 cameras, network equipment as required, and a variable number of guest devices. The employee network therefore starts with 25 computers. For sizing only, this draft assumes up to 100 concurrent guest devices; the brief does not specify a guest count.

#### Proposed subnets

All addresses use the private 10.0.0.0/8 range. Each VLAN has a separate subnet and a gateway interface on the router/firewall. Usable addresses exclude the network and broadcast addresses; the gateway consumes one usable address.

| VLAN | Group and current demand | Network/CIDR | Subnet mask | Proposed gateway | Usable addresses |
| --- | --- | --- | --- | --- | --- |
| 570 | Employees: 15 desktops + 10 laptops | 10.5.70.0/24 | 255.255.255.0 | 10.5.70.1 | 254 |
| 571 | Servers: 3 | 10.5.71.0/24 | 255.255.255.0 | 10.5.71.1 | 254 |
| 572 | Printers: 3 | 10.5.72.0/28 | 255.255.255.240 | 10.5.72.1 | 14 |
| 573 | IP phones: 12 | 10.5.73.0/27 | 255.255.255.224 | 10.5.73.1 | 30 |
| 574 | Cameras: 6 | 10.5.74.0/28 | 255.255.255.240 | 10.5.74.1 | 14 |
| 575 | Management: 4 access points + network equipment | 10.5.75.0/27 | 255.255.255.224 | 10.5.75.1 | 30 |
| 576 | Guests: variable; sizing assumption of 100 | 10.5.76.0/24 | 255.255.255.0 | 10.5.76.1 | 254 |

#### Address allocation and growth

Static addresses keep servers and shared equipment reachable at a stable address. DHCP assigns addresses automatically to employee computers, phones, and guests. Fixed addresses and gateways are outside the DHCP pools.

| VLAN | Proposed device allocation | Growth capacity |
| --- | --- | --- |
| 570 | DHCP: 10.5.70.50-10.5.70.199 | Pool supports 150 computers, compared with 25 today. Other host addresses remain reserved. |
| 571 | Static servers: 10.5.71.10-10.5.71.12; application server proposed at 10.5.71.10 | 253 device addresses after the gateway. Keep the assignment's /24 even though three servers need much less space. |
| 572 | Static printers: 10.5.72.2-10.5.72.4 | 13 device addresses after the gateway; room for 10 additional printers. |
| 573 | DHCP: 10.5.73.2-10.5.73.30 | Pool supports 29 phones; room for 17 additional phones. |
| 574 | Static cameras: 10.5.74.2-10.5.74.7 | 13 device addresses after the gateway; room for 7 additional cameras. |
| 575 | Static access points: 10.5.75.2-10.5.75.5; switches and other management interfaces: 10.5.75.6-10.5.75.30 | 29 device addresses after the gateway, including the 4 access points. Confirm the equipment count before finalizing. |
| 576 | DHCP: 10.5.76.20-10.5.76.219 | Pool supports 200 guests, leaving 100 spare leases above the sizing assumption. |

DHCP scopes should supply the approved gateway and DNS resolver addresses. The academy's DNS and DHCP services are still to be confirmed. Unallocated addresses are reserved for future use. If demand exceeds a subnet's capacity, revise the subnet and DHCP scope before adding devices; no subnet in this draft overlaps another.

#### Why the groups are separated

Employee computers and servers use separate networks so access to services can be controlled at the router/firewall. Printers, phones, and cameras each have their own segment because they perform different jobs and need different access rules. Management interfaces are separated from everyday traffic. The four access points have management addresses in VLAN 575; in this proposed design, employee Wi-Fi traffic joins VLAN 570 and guest Wi-Fi traffic joins VLAN 576 through separate SSIDs and VLAN-capable equipment.

The proposed company policy is to allow only required traffic between VLANs. Employees need access to the login service and printing. Guests need Internet access without access to company or management networks. Camera access should be limited to the authorized viewing or recording service, and device administration should be limited to an approved management workstation. The exact business-service ports and management access rules must be confirmed before implementation. VLANs provide segmentation; routing and firewall rules determine permitted communication.

In the academy, the required test is the VLAN 570 client reaching the VLAN 571 application on TCP port 8000. The assignment states that the network firewall already permits TCP 8000-8100 in that direction. Record the result of that test separately from this proposed company policy.

#### Subnetting examples

| Example | Network | Mask | Usable host range | Broadcast | Calculation |
| --- | --- | --- | --- | --- | --- |
| Employees | 10.5.70.0/24 | 255.255.255.0 | 10.5.70.1-10.5.70.254 | 10.5.70.255 | 2^(32-24) - 2 = 254 usable addresses |
| IP phones | 10.5.73.0/27 | 255.255.255.224 | 10.5.73.1-10.5.73.30 | 10.5.73.31 | 2^(32-27) - 2 = 30 usable addresses |

The employee /24 is specified by the assignment and provides space beyond the 25 current computers. After reserving the gateway, 253 device addresses remain; the initial DHCP pool uses 150 of them. A /27 fits the 12 phones and allows growth: after the gateway, 29 phone addresses remain. A /28 would leave only 13 phone addresses after its gateway, allowing just one additional phone, so this draft chooses /27.

#### Editing the draft

To change a proposed segment, update its network, mask, gateway, allocation, capacity, and any subnetting example together. Keep the assigned VLAN 570 and 571 /24 networks. Enter the actual academy values in the table below after confirming them; proposed company addresses are not evidence of VM configuration. The company network diagram remains to be created from the agreed plan.

### Lab deployment

| Machine | VLAN | Network | Operating system |
| --- | --- | --- | --- |
| Client VM | 570 | 10.5.70.0/24 | To be selected |
| Server VM | 571 | 10.5.71.0/24 | Ubuntu Server |

| Actual VM setting | Server | Client |
| --- | --- | --- |
| VM name / ID | Azade-kas / 101, from Azade's notes and screenshot | To be created or confirmed |
| IP address / prefix | To confirm in the academy | To confirm in the academy |
| Default gateway | To confirm in the academy | To confirm in the academy |
| DNS resolver(s) | To confirm in the academy | To confirm in the academy |
| Static or DHCP | To confirm in the academy | To confirm in the academy |
| Date and configuration evidence | To record during verification | To record during verification |

The login platform must run in Docker on the server and be accessible from the client VM using the server's IP and a documented TCP port from **8000 to 8100**.

The network firewall already permits TCP 8000-8100 from VLAN 570 to VLAN 571. Lab access and VM network settings are tracked in [issue #2](https://github.com/zsaamu/cds-compulsory-assignment/issues/2).

### Required evidence and explanation

Document Ubuntu Server installation, both VMs' IP configuration, Docker installation, the running container and published port, and successful use of the platform from the client VM.

Explain VLAN separation, routing between the networks, the firewall's role, and why access is limited to specific ports. Record implementation problems, their causes, fixes, and retest results.

## Final report and submission

Complete the Security and Infrastructure sections with the implemented solution, screenshots, tables, diagrams, and test results. Conclude with a short reflection on how security and infrastructure connect, deployment lessons, and changes needed for a real company.

Register the group on Moodle, confirm the assessor can access the GitHub repository, and submit through Moodle by **6 November 2026 at 23:59**. Our target submission date is **4 November**.

Source: `Compulsory-assignment.pdf`, case Kvist & Bjælke ApS, pages 2-9.

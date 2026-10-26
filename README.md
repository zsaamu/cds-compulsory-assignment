# CDS compulsory assignment

Login and user management platform for Kvist & Bjælke ApS, with network planning and Docker deployment. This README is the combined report for **CDS.security** and **CDS.infrastructure**.

Status: repository setup. Application development and deployment are pending.

## Responsibilities

| Member | GitHub | Responsibility |
| --- | --- | --- |
| Samuele | [zsaamu](https://github.com/zsaamu) | Infrastructure, integration testing, report coordination, and final review/merge |
| Kyrylo | [Kyrylo-Vorona](https://github.com/Kyrylo-Vorona) | Backend, database, authentication, and authorization |
| Azade | [azade1416](https://github.com/azade1416) | Frontend and API integration |

Each member documents their own work. Samuele and Kyrylo handle Docker deployment together.

## Issues and workflow

The [agreed issues](https://github.com/zsaamu/cds-compulsory-assignment/issues) list owners, dependencies, target dates, and acceptance checks. Start with [repository setup #1](https://github.com/zsaamu/cds-compulsory-assignment/issues/1) and [lab access #2](https://github.com/zsaamu/cds-compulsory-assignment/issues/2).

Work on task branches and open pull requests to `main`. Samuele reviews, tests, and merges the changes. See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and [the reuse plan](docs/reuse.md) for the selected Satin Road functions.

```text
backend/          API and database
frontend/         Browser interface
tests/            Security and integration tests
infrastructure/   Network plan and deployment
docs/             Work plan, reuse notes, and test plan
README.md         Combined assignment report
```

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

All dates are in 2026. Work is scheduled on weekdays only. See the [detailed timeline](docs/plan.md) and [milestones](https://github.com/zsaamu/cds-compulsory-assignment/milestones).

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

Check permissions on every protected request, including the target account's role. Keep passwords and hashes out of the user table and API responses.

### Required documentation

Describe the platform, authentication, password handling, role checks, technology choices, and security alternatives considered. Add relevant screenshots and verified setup and test instructions as implementation progresses. Use [the test plan](docs/test-plan.md) to collect results.

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

Install Docker on the server and deploy the login platform in a container. Access it from the client VM using the server's IP and a TCP port from **8000 to 8100**; the proposed port is **8080**.

The network firewall already permits TCP 8000-8100 from VLAN 570 to VLAN 571. Confirm lab access and the allocated VM addresses, gateways, DNS, and DHCP settings in [issue #2](https://github.com/zsaamu/cds-compulsory-assignment/issues/2). Follow [the infrastructure preparation](infrastructure/README.md) for the lab session.

### Required evidence and explanation

Document Ubuntu Server installation, both VMs' IP configuration, Docker installation, the running container and published port, and successful use of the platform from the client VM.

Explain VLAN separation, routing between the networks, the firewall's role, and why access is limited to specific ports. Record implementation problems, their causes, fixes, and retest results.

## Final report and submission

Complete the Security and Infrastructure sections with the implemented solution, screenshots, tables, diagrams, and test results. Conclude with a short reflection on how security and infrastructure connect, deployment lessons, and changes needed for a real company.

Register the group on Moodle, confirm the assessor can access the GitHub repository, and submit through Moodle by **6 November 2026 at 23:59**. Our target submission date is **4 November**.

Source: `Compulsory-assignment.pdf`, case Kvist & Bjælke ApS, pages 2-9.

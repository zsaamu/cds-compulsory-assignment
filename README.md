# CDS compulsory assignment

A web-based login and user management platform for Kvist & Bjælke ApS, with a network plan and Docker deployment on the academy's virtual infrastructure.

This repository covers **CDS.security** and **CDS.infrastructure**. The README is the combined assignment report.

## Current status

Project setup and planning are in progress. The application has not been implemented or deployed in this repository. Test results and screenshots will be added after the work has been verified.

## Team

| Member | GitHub | Main responsibility |
| --- | --- | --- |
| Samuele | [zsaamu](https://github.com/zsaamu) | Infrastructure, integration testing, and report coordination |
| Kyrylo | [Kyrylo-Vorona](https://github.com/Kyrylo-Vorona) | Backend, database, authentication, and authorization |
| Azade | [azade1416](https://github.com/azade1416) | Frontend and API integration |

Each member documents their own work. We review the full solution together. Docker deployment is shared by Samuele and Kyrylo.

## Scope

- Log in with a username and password, and log out.
- Store password hashes and keep passwords and hashes out of API responses, logs, and screenshots.
- Apply the assignment's user, superuser, and admin permissions on the backend.
- Provide a simple user table and the management actions allowed for each role.
- Run the application in Docker on an Ubuntu Server VM in VLAN 571.
- Access the application from a second VM in VLAN 570 using a TCP port from 8000 to 8100.
- Document the company network plan, subnetting, deployment, tests, and lessons learned.

Marketplace features such as products, purchases, categories, and inventory are outside this assignment.

## CDS.security

### Required permissions

| Action | User | Superuser | Admin |
| --- | --- | --- | --- |
| Read the user table | Yes | Yes | Yes |
| Create, update, and delete ordinary user accounts | No | Yes | Yes |
| Create, update, and delete superuser or admin accounts | No | No | Yes |
| Assign or change a privileged role | No | No | Yes |

Every protected request must be checked by the server, including the target account's role. Interface controls should reflect those permissions. Passwords and hashes must never appear in the table.

### Implementation and decisions

Planned starting point: reuse the team's .NET API, React login screen, session handling, password hasher, and Docker build patterns from [Satin Road](https://github.com/Kyrylo-Vorona/satin-road-kas). The team must confirm the technology choices and adapt the code to this assignment before calling it complete.

To complete during implementation:

- Describe authentication, password hashing, session handling, and role checks.
- Explain the chosen technologies and security alternatives considered.
- Document database creation and the first administrator account without committing credentials.
- Add screenshots showing the required functions and permission checks.

## CDS.infrastructure

### Assigned lab networks

| Purpose | VLAN | Network | VM operating system |
| --- | --- | --- | --- |
| Client | 570 | 10.5.70.0/24 | To be selected; the brief does not prescribe a client OS |
| Server | 571 | 10.5.71.0/24 | Ubuntu Server |

The brief abbreviates the server network as `10.5.71/24`; this plan interprets it as `10.5.71.0/24`. Confirm the gateway, DNS, DHCP availability, and permitted VM addresses before configuring the lab. Do not assume that `.1` is the gateway or pick an address without checking its allocation.

Proposed application port: **TCP 8080**, within the required range. The brief states that the network firewall already permits TCP 8000-8100 from VLAN 570 to VLAN 571. We must still verify VM networking, the host firewall, and container access.

The final setup requires two VMs. The server runs Docker inside Ubuntu Server; an LXC container is not the server VM required by this brief.

### Company network plan and subnetting

Pending: a justified segmentation plan covering 15 desktops, 10 laptops, 3 printers, 3 servers, 12 IP phones, 4 wireless access points, 6 cameras, network equipment, and a variable number of guest devices, with room for growth.

The final table must state the private network, CIDR or mask, gateway, device types, and DHCP or static addressing for each segment. Explain network addresses, usable host counts, sizing, and growth for at least two subnets.

### Network diagram

Pending: the overall company design, including Internet access, router/firewall, switches, VLANs, servers, employee devices, other device groups, wireless networks, and segment connections. Only the client/server lab portion needs to be implemented.

The brief calls the diagram optional in section 2.5 but lists it in the submission requirements. We will include it.

### Installation, deployment, and evidence

Pending: Ubuntu Server installation, server/client IP configuration, Docker installation, application startup, and browser access from the client VM.

Explain why the VLANs are separate, why traffic between them needs routing, how the firewall controls access, and why only specific ports are allowed.

Collect evidence as the work is performed. A local `localhost` test does not demonstrate access from VLAN 570 to VLAN 571.

## Setup and testing

There is no runnable application yet. Backend, frontend, Docker, database setup, and test commands will be added and checked in their implementation issues. Do not reuse the shared marketplace database for destructive tests.

## Plan and submission

Work is scheduled on weekdays only. The target is to finish implementation and documentation by **3 November 2026**, review and submit on **4 November**, and keep **5 November** for study and unexpected problems.

Official deadline in the assignment PDF: **6 November 2026 at 23:59 on Moodle**. Register the group on Moodle and confirm that the assessor can access the submitted repository.

The PDF does not require an oral presentation. Explaining the work to each other is part of our study plan.

## Challenges and final reflection

To be written from the actual work: problems encountered, their causes and fixes, how security and infrastructure connect, what we learned about deployment, and what we would change for a real company.

## Assignment reference

Requirements are taken from `Compulsory-assignment.pdf`, case Kvist & Bjælke ApS, especially pages 2-9. Course exercises are learning references; their extra tasks are not automatically requirements of this assignment. The source PDFs and lab credentials are not included in this repository.

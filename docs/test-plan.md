# Test plan

Status: all checks are **Not run**. Replace the status with the actual result, date, and evidence when each check is performed. Never fill this table from an expected result alone.

## Application checks

| ID | Check | Expected result | Status |
| --- | --- | --- | --- |
| S01 | Log in with valid credentials | Account identity and role are available through a server-verified session | Not run |
| S02 | Use an incorrect username or password | Login is rejected without revealing which credential was wrong | Not run |
| S03 | Request the user table without logging in | The protected API rejects the request | Not run |
| S04 | Read the user table as each required role | Allowed data is shown; passwords and hashes are absent | Not run |
| S05 | Send create/update/delete requests as User | Requests are rejected and data is unchanged | Not run |
| S06 | Manage ordinary user accounts as Superuser | Create, read, update, and delete succeed | Not run |
| S07 | Target an admin or superuser account as Superuser | The server rejects the request and data is unchanged | Not run |
| S08 | Request a privileged role through a Superuser create/update request | The server rejects it and no privileged account is created | Not run |
| S09 | Manage all three account roles as Admin | Required create, read, update, and delete operations succeed | Not run |
| S10 | Log out and request a protected action | The old browser session no longer provides access | Not run |
| S11 | Inspect password handling with isolated test data | Database values are hashes; responses and logs do not reveal passwords or hashes | Not run |
| S12 | Use the interface as each role and refresh the page | Session and available actions match the server's rules | Not run |

Perform forbidden actions directly against the API. A hidden button alone is not proof of authorization. Use separate test accounts, record before/after state for rejected writes, and avoid exposing credentials in evidence.

## Infrastructure checks

| ID | Check | Evidence needed | Status |
| --- | --- | --- | --- |
| I01 | Ubuntu Server is installed on the server VM | OS and VM configuration | Not run |
| I02 | Server is connected to VLAN 571 with the allocated configuration | VM network setting, IP/mask, gateway, and route | Not run |
| I03 | Docker is installed and the application container runs | Docker version, container status, and published port | Not run |
| I04 | A second VM is connected to VLAN 570 | VM network setting, IP/mask, gateway, and route | Not run |
| I05 | Client VM opens the application on the server's IP and selected TCP port | Browser URL and a successful page response from that client | Not run |
| I06 | Required login and role functions work from the client VM | Browser evidence and role checks | Not run |
| I07 | Explain routing and the permitted traffic | Network diagram, addressing plan, and explanation in the README | Not run |

A ping failure alone does not establish that the web service is unreachable: the given network rule is for TCP 8000-8100, not an ICMP guarantee. Check the actual service port.

For a failure, record the symptom, the check used to locate the cause, the change made, and the successful retest. Add final evidence to the root README before submission.

# Infrastructure preparation

Owner: Samuele. Kyrylo supports application deployment. The group performs the final client/server checks together.

## Confirm before configuring the lab

- Is remote access to Proxmox and the required VM consoles available? What is the approved procedure?
- Can the group use the laboratory on 2 November, with 3 November available for a retest?
- Which addresses are allocated to the group in VLAN 570 and VLAN 571?
- What are the actual gateway, DNS, and DHCP settings for each network?
- Which Proxmox node, VM permissions, network bridge or SDN network, and VLAN settings should be used?

Knowing a private IP address does not provide remote access. The Week 43 exercise describes a physical connection in the Cisco lab; the compulsory assignment requires a server VM and a client VM. Do not assume those are identical tasks.

## Company inventory from the brief

| Devices | Count |
| --- | --- |
| Desktops | 15 |
| Laptops | 10 |
| Printers | 3 |
| Servers | 3 |
| IP phones | 12 |
| Wireless access points | 4 |
| Cameras | 6 |
| Switches, routers, and other network equipment | As required |
| Guest devices | Variable |

The addressing design must cover every device group and room for growth. Separate the full company proposal from the smaller implemented lab setup.

## Lab values

| Item | Known or planned value | Still to confirm |
| --- | --- | --- |
| Client network | VLAN 570, 10.5.70.0/24 | VM address, gateway, DNS, and DHCP |
| Server network | VLAN 571, 10.5.71.0/24 | VM address, gateway, DNS, and DHCP |
| Server operating system | Ubuntu Server | Version agreed by the team |
| Web port | TCP 8080 proposed | Availability and final Docker mapping |
| Network firewall | Brief states TCP 8000-8100 is allowed from 570 to 571 | Verify the actual service path during testing |

Both /24 networks use mask 255.255.255.0 and have 254 conventional usable host addresses. The gateway consumes one of those addresses. These assigned sizes must be kept for the lab; justify sizing and growth in the company plan as well.

The final subnet examples must include network address, mask, usable host count, device demand, and expansion capacity for at least two networks.

## Planned lab session

1. Record the VM configuration and install Ubuntu Server in the server VM on VLAN 571.
2. Apply the approved IP configuration and check the route and DNS.
3. Install Docker and deploy the reviewed application using its documented database setup.
4. Publish the selected host port on an interface reachable by the client. Verify application binding, Docker mapping, and host firewall settings.
5. Prepare the separate client VM on VLAN 570 and verify its IP configuration.
6. Open `http://SERVER_IP:8080` from the client if the agreed setup uses HTTP, or the documented HTTPS URL if TLS is configured. Replace SERVER_IP with the allocated server address.
7. Test the required role functions and collect the evidence listed in [the test plan](../docs/test-plan.md).

This is a procedure to follow, not evidence that installation or deployment has happened. Local Docker tests are preparation for the assigned VLAN test.

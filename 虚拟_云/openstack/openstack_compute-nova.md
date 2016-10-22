openstack: compute-nova
2016年6月25日
22:17
 
Use OpenStack Compute to host and manage cloud computing systems. OpenStack Compute is a major part of an Infrastructure-as-a-Service (IaaS) system. The main modules are implemented in Python.
OpenStack Compute interacts with OpenStack Identity for authentication; OpenStack Image service for disk and server images; and OpenStack dashboard for the user and administrative interface. Image access is limited by projects, and by users; quotas are limited per project (the number of instances, for example). OpenStack Compute can scale horizontally on standard hardware, and download images to launch instances.
OpenStack Compute consists of the following areas and their components:
nova-api service
Accepts and responds to end user compute API calls. The service supports the OpenStack Compute API, the Amazon EC2 API, and a special Admin API for privileged users to perform administrative actions. It enforces some policies and initiates most orchestration activities, such as running an instance.
nova-api-metadata service
Accepts metadata requests from instances. The nova-api-metadata service is generally used when you run in multi-host mode with nova-network installations. For details, see Metadata service in the OpenStack Administrator Guide.
nova-compute service
A worker daemon that creates and terminates virtual machine instances through hypervisor APIs. For example:
o XenAPI for XenServer/XCP
o libvirt for KVM or QEMU
o VMwareAPI for VMware
Processing is fairly complex. Basically, the daemon accepts actions from the queue and performs a series of system commands such as launching a KVM instance and updating its state in the database.
nova-scheduler service
Takes a virtual machine instance request from the queue and determines on which compute server host it runs.
nova-conductor module
Mediates interactions between the nova-compute service and the database. It eliminates direct accesses to the cloud database made by the nova-compute service. The nova-conductor module scales horizontally. However, do not deploy it on nodes where the nova-compute service runs. For more information, see Configuration Reference Guide.
nova-cert module
A server daemon that serves the Nova Cert service for X509 certificates. Used to generate certificates for euca-bundle-image. Only needed for the EC2 API.
nova-network worker daemon
Similar to the nova-compute service, accepts networking tasks from the queue and manipulates the network. Performs tasks such as setting up bridging interfaces or changing IPtables rules.
nova-consoleauth daemon
Authorizes tokens for users that console proxies provide. See nova-novncproxy and nova-xvpvncproxy. This service must be running for console proxies to work. You can run proxies of either type against a single nova-consoleauth service in a cluster configuration. For information, see About nova-consoleauth.
nova-novncproxy daemon
Provides a proxy for accessing running instances through a VNC connection. Supports browser-based novnc clients.
nova-spicehtml5proxy daemon
Provides a proxy for accessing running instances through a SPICE connection. Supports browser-based HTML5 client.
nova-xvpvncproxy daemon
Provides a proxy for accessing running instances through a VNC connection. Supports an OpenStack-specific Java client.
nova-cert daemon
x509 certificates.
nova client
Enables users to submit commands as a tenant administrator or end user.
The queue
A central hub for passing messages between daemons. Usually implemented with RabbitMQ, but can be implemented with an AMQP message queue, such as Zero MQ.
SQL database
Stores most build-time and run-time states for a cloud infrastructure, including:
o Available instance types
o Instances in use
o Available networks
o Projects
Theoretically, OpenStack Compute can support any database that SQL-Alchemy supports. Common databases are SQLite3 for test and development work, MySQL, and PostgreSQL.
 
来自 <http://docs.openstack.org/mitaka/install-guide-rdo/common/get_started_compute.html> 

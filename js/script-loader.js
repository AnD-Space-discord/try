/**
 * Lab Scripts Loader
 * Automatically generates download links for lab configuration scripts.
 */

const labScriptsData = {
    'acl.lab.html': { folder: 'ACL', files: ['R1.txt', 'SW1.txt'], pkt: 'acl.pkt' },
    'acl-lab.html': { folder: 'ACL', files: ['R1.txt', 'SW1.txt'], pkt: 'acl.pkt' },
    'dhcp.lab.html': { folder: 'DHCP', files: ['R1.txt'], pkt: 'dhcp.pkt' },
    'eigrp.lab.html': { folder: 'EIGRP', files: ['R1.txt', 'R2.txt', 'R3.txt'], pkt: 'eigrp.pkt' },
    'intervlan.lab.html': { folder: 'InterVLAN', files: ['R1.txt', 'SW1.txt'], pkt: 'intervlan.pkt' },
    'ipv6.lab.html': { folder: 'IPv6', files: ['R1.txt', 'R2.txt'], pkt: 'ipv6.pkt' },
    'nat.lab.html': { folder: 'NAT', files: ['R1.txt'], pkt: 'nat.pkt' },
    'ospf.lab.html': { folder: 'OSPF', files: ['R1.txt', 'R2.txt', 'R3.txt'], pkt: 'ospf.pkt' },
    'ospf-multi-area.lab.html': { folder: 'OSPFMultiArea', files: ['R1.txt', 'R2.txt', 'R3.txt', 'R4.txt'], pkt: 'ospf-multi-area.pkt' },
    'port-security.lab.html': { folder: 'PortSecurity', files: ['SW1.txt'], pkt: 'port-security.pkt' },
    'rip.lab.html': { folder: 'RIP', files: ['R1.txt', 'R2.txt'], pkt: 'rip.pkt' },
    'static-routing.lab.html': { folder: 'StaticRouting', files: ['R1.txt', 'R2.txt'], pkt: 'static-routing.pkt' },
    'trunk.lab.html': { folder: 'Trunk', files: ['SW1.txt', 'SW2.txt'], pkt: 'trunk.pkt' },
    'LAB01.lab.html': { folder: 'Vlan', files: ['SW1.txt'], pkt: 'LAB01.pkt' },
    'basic.cli.lab.html': { folder: 'BasicCLI', files: ['R1.txt'], pkt: 'basic-cli.pkt' },
    'rsa.ssh.lab.html': { folder: 'RSA', files: ['R1.txt'], pkt: 'rsa-ssh.pkt' }
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();

    const labData = labScriptsData[fileName];
    if (!labData) return;

    const container = document.getElementById('script-downloads-container');
    if (!container) return;

    let html = `
        <section class="resources mt-5">
            <h2>Lab Resources</h2>
            <p>Access the full configuration scripts for each networking device in this lab.</p>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <h5 class="mb-3">🔍 Quick View</h5>
                    <div class="d-flex flex-wrap gap-2">
    `;

    labData.files.forEach(file => {
        const deviceName = file.replace('.txt', '');
        const scriptPath = `../Scripts/${labData.folder}/${file}`;

        html += `
            <a href="${scriptPath}" target="_blank" class="btn btn-primary btn-sm px-4">
                View ${deviceName}.txt
            </a>
        `;
    });

    html += `
                    </div>
                </div>
                
                <div class="col-md-6">
                    <h5 class="mb-3"><i class="fas fa-file-download me-2"></i> Script Downloads</h5>
                    <div class="d-grid gap-2">
    `;

    labData.files.forEach(file => {
        const deviceName = file.replace('.txt', '');
        const scriptPath = `../Scripts/${labData.folder}/${file}`;

        html += `
            <a href="${scriptPath}" download="${deviceName}-config.txt" class="btn btn-success d-flex align-items-center justify-content-center gap-2 py-2">
                <i class="fas fa-file-code"></i>
                Download ${deviceName} Configuration
            </a>
        `;
    });

    html += `
                    </div>
                </div>
            </div>
        </section>
    `;

    container.innerHTML = html;
});

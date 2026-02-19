/**
 * CCNA-LABS Download Broker
 * Manages all file downloads with a premium user experience.
 */

class DownloadBroker {
    constructor() {
        this.init();
    }

    init() {
        this.createBrokerUI();

        document.addEventListener('click', (e) => {
            const downloadLink = e.target.closest('a[download]');
            if (downloadLink) {
                e.preventDefault();
                this.handleDownload(downloadLink);
            }
        });
    }

    createBrokerUI() {
        const overlay = document.createElement('div');
        overlay.id = 'download-broker-overlay';
        overlay.innerHTML = `
            <div class="broker-card">
                <div class="broker-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                </div>
                <div class="broker-content">
                    <h4 id="broker-status">Verifying File...</h4>
                    <p id="broker-filename">Preparing your file</p>
                    <div class="broker-progress">
                        <div class="broker-bar"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    handleDownload(link) {
        const url = link.href;
        const filename = link.getAttribute('download') || 'download';

        // 1. Update UI and Show
        document.getElementById('broker-filename').textContent = filename;
        document.getElementById('broker-status').textContent = 'Securing Connection...';
        document.getElementById('broker-status').style.color = '#fff';
        this.overlay.classList.add('active');

        const progressBar = this.overlay.querySelector('.broker-bar');
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        // Force reflow
        progressBar.offsetHeight;

        progressBar.style.transition = 'width 1.2s linear';
        progressBar.style.width = '100%';

        // 2. Trigger download IMMEDIATELY while the user sees the "Securing" animation
        // This ensures the browser respects the user gesture
        const hiddenLink = document.createElement('a');
        hiddenLink.href = url;
        hiddenLink.download = filename;
        hiddenLink.style.display = 'none';
        document.body.appendChild(hiddenLink);
        hiddenLink.click();
        document.body.removeChild(hiddenLink);

        // 3. Fake the "Verification" process for premium feel
        setTimeout(() => {
            document.getElementById('broker-status').textContent = 'Download Started!';
            document.getElementById('broker-status').style.color = '#10b981';

            // Close after a brief moment
            setTimeout(() => {
                this.overlay.classList.remove('active');
            }, 1500);
        }, 1200);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.ccnaDownloadBroker = new DownloadBroker();
});

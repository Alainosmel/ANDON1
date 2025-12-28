// ANDON System Rev B - JavaScript

class AndonSystem {
    constructor() {
        this.stations = [
            { id: 1, name: 'Station A1', status: 'normal' },
            { id: 2, name: 'Station A2', status: 'normal' },
            { id: 3, name: 'Station B1', status: 'normal' },
            { id: 4, name: 'Station B2', status: 'normal' },
            { id: 5, name: 'Station C1', status: 'normal' },
            { id: 6, name: 'Station C2', status: 'normal' }
        ];
        
        this.alerts = [];
        this.soundEnabled = true;
        
        this.init();
    }

    init() {
        // Load saved data from localStorage
        this.loadData();
        
        // Render initial UI
        this.renderStations();
        this.updateStatistics();
        this.renderHistory();
        this.updateSystemStatus();
        this.populateFilterDropdown();
        
        // Update time display every minute
        setInterval(() => this.renderHistory(), 60000);
    }

    loadData() {
        const savedAlerts = localStorage.getItem('andon_alerts');
        const savedStations = localStorage.getItem('andon_stations');
        const savedSound = localStorage.getItem('andon_sound');
        
        if (savedAlerts) {
            this.alerts = JSON.parse(savedAlerts);
        }
        
        if (savedStations) {
            this.stations = JSON.parse(savedStations);
        }
        
        if (savedSound !== null) {
            this.soundEnabled = JSON.parse(savedSound);
            this.updateSoundIcon();
        }
    }

    saveData() {
        localStorage.setItem('andon_alerts', JSON.stringify(this.alerts));
        localStorage.setItem('andon_stations', JSON.stringify(this.stations));
        localStorage.setItem('andon_sound', JSON.stringify(this.soundEnabled));
    }

    renderStations() {
        const grid = document.getElementById('stations-grid');
        grid.innerHTML = '';
        
        this.stations.forEach(station => {
            const card = document.createElement('div');
            card.className = `station-card status-${station.status}`;
            card.innerHTML = `
                <div class="station-header">
                    <div class="station-name">${station.name}</div>
                    <div class="station-light"></div>
                </div>
                <div class="station-info">
                    Status: <strong>${this.getStatusText(station.status)}</strong><br>
                    ${station.alertTime ? `Alert: ${this.formatTime(station.alertTime)}` : 'No active alerts'}
                </div>
                <div class="station-buttons">
                    ${station.status === 'normal' ? `
                        <button class="station-btn btn-help" onclick="andonSystem.triggerAlert(${station.id}, 'help')">
                            ⚠️ Help
                        </button>
                        <button class="station-btn btn-defect" onclick="andonSystem.triggerAlert(${station.id}, 'defect')">
                            ❌ Defect
                        </button>
                        <button class="station-btn btn-stop" onclick="andonSystem.triggerAlert(${station.id}, 'stop')">
                            🛑 Stop
                        </button>
                        <button class="station-btn btn-maintenance" onclick="andonSystem.triggerAlert(${station.id}, 'maintenance')">
                            🔧 Maintenance
                        </button>
                    ` : `
                        <button class="station-btn btn-resolve" onclick="andonSystem.resolveAlert(${station.id})">
                            ✓ Resolve Issue
                        </button>
                    `}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'normal': '✓ Normal',
            'warning': '⚠️ Warning',
            'critical': '🚨 Critical'
        };
        return statusMap[status] || status;
    }

    triggerAlert(stationId, type) {
        const station = this.stations.find(s => s.id === stationId);
        if (!station) return;

        const alert = {
            id: Date.now(),
            stationId: stationId,
            stationName: station.name,
            type: type,
            timestamp: new Date().toISOString(),
            status: 'active',
            resolvedAt: null
        };

        this.alerts.push(alert);
        
        // Update station status
        station.status = (type === 'stop' || type === 'defect') ? 'critical' : 'warning';
        station.alertTime = new Date().toISOString();
        station.activeAlertId = alert.id;

        // Play sound
        if (this.soundEnabled) {
            this.playAlertSound(type);
        }

        // Update UI
        this.renderStations();
        this.updateStatistics();
        this.renderHistory();
        this.updateSystemStatus();
        this.saveData();

        // Show notification
        this.showNotification(`Alert triggered at ${station.name}`, type);
    }

    resolveAlert(stationId) {
        const station = this.stations.find(s => s.id === stationId);
        if (!station || !station.activeAlertId) return;

        const alert = this.alerts.find(a => a.id === station.activeAlertId);
        if (alert) {
            alert.status = 'resolved';
            alert.resolvedAt = new Date().toISOString();
        }

        // Reset station status
        station.status = 'normal';
        station.alertTime = null;
        station.activeAlertId = null;

        // Update UI
        this.renderStations();
        this.updateStatistics();
        this.renderHistory();
        this.updateSystemStatus();
        this.saveData();

        // Show notification
        this.showNotification(`Issue resolved at ${station.name}`, 'success');
    }

    resetAllStations() {
        if (!confirm('Reset all stations to normal status? This will resolve all active alerts.')) {
            return;
        }

        // Resolve all active alerts
        this.alerts.forEach(alert => {
            if (alert.status === 'active') {
                alert.status = 'resolved';
                alert.resolvedAt = new Date().toISOString();
            }
        });

        // Reset all stations
        this.stations.forEach(station => {
            station.status = 'normal';
            station.alertTime = null;
            station.activeAlertId = null;
        });

        // Update UI
        this.renderStations();
        this.updateStatistics();
        this.renderHistory();
        this.updateSystemStatus();
        this.saveData();

        this.showNotification('All stations reset to normal', 'success');
    }

    clearHistory() {
        if (!confirm('Clear all alert history? This action cannot be undone.')) {
            return;
        }

        this.alerts = [];
        this.renderHistory();
        this.updateStatistics();
        this.saveData();

        this.showNotification('Alert history cleared', 'info');
    }

    updateStatistics() {
        const totalAlerts = this.alerts.length;
        const activeAlerts = this.alerts.filter(a => a.status === 'active').length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const resolvedToday = this.alerts.filter(a => 
            a.status === 'resolved' && new Date(a.resolvedAt) >= today
        ).length;

        // Calculate average response time
        const resolvedAlerts = this.alerts.filter(a => a.status === 'resolved' && a.resolvedAt);
        let avgResponse = '-';
        if (resolvedAlerts.length > 0) {
            const totalResponseTime = resolvedAlerts.reduce((sum, alert) => {
                const responseTime = new Date(alert.resolvedAt) - new Date(alert.timestamp);
                return sum + responseTime;
            }, 0);
            const avgMs = totalResponseTime / resolvedAlerts.length;
            avgResponse = Math.round(avgMs / 60000); // Convert to minutes
        }

        document.getElementById('total-alerts').textContent = totalAlerts;
        document.getElementById('active-alerts').textContent = activeAlerts;
        document.getElementById('resolved-alerts').textContent = resolvedToday;
        document.getElementById('avg-response').textContent = avgResponse;
    }

    renderHistory() {
        const historyList = document.getElementById('history-list');
        
        if (this.alerts.length === 0) {
            historyList.innerHTML = '<p class="no-data">No alerts recorded yet.</p>';
            return;
        }

        // Get filter values
        const filterStation = document.getElementById('filter-station').value;
        const filterType = document.getElementById('filter-type').value;

        // Filter alerts
        let filteredAlerts = [...this.alerts];
        if (filterStation !== 'all') {
            filteredAlerts = filteredAlerts.filter(a => a.stationId == filterStation);
        }
        if (filterType !== 'all') {
            filteredAlerts = filteredAlerts.filter(a => a.type === filterType);
        }

        // Sort by timestamp (newest first)
        filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        historyList.innerHTML = filteredAlerts.map(alert => `
            <div class="history-item type-${alert.type} ${alert.status}">
                <div class="history-item-info">
                    <div class="history-item-station">${alert.stationName}</div>
                    <div>
                        <span class="history-item-type">${this.formatAlertType(alert.type)}</span>
                        <span class="history-item-time">
                            ${this.formatDateTime(alert.timestamp)}
                            ${alert.resolvedAt ? ` → Resolved: ${this.formatDateTime(alert.resolvedAt)}` : ''}
                        </span>
                    </div>
                </div>
                <div class="history-item-status ${alert.status}">
                    ${alert.status === 'active' ? '🔴 Active' : '✅ Resolved'}
                </div>
            </div>
        `).join('');
    }

    filterHistory() {
        this.renderHistory();
    }

    populateFilterDropdown() {
        const filterStation = document.getElementById('filter-station');
        this.stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = station.name;
            filterStation.appendChild(option);
        });
    }

    updateSystemStatus() {
        const indicator = document.getElementById('system-status');
        const statusText = document.getElementById('status-text');
        
        const hasActiveAlerts = this.alerts.some(a => a.status === 'active');
        
        if (hasActiveAlerts) {
            indicator.className = 'status-indicator alert';
            statusText.textContent = 'Active Alerts';
        } else {
            indicator.className = 'status-indicator active';
            statusText.textContent = 'System Active';
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.updateSoundIcon();
        this.saveData();
        this.showNotification(
            `Sound alerts ${this.soundEnabled ? 'enabled' : 'disabled'}`,
            'info'
        );
    }

    updateSoundIcon() {
        const icon = document.getElementById('sound-icon');
        icon.textContent = this.soundEnabled ? '🔊' : '🔇';
    }

    playAlertSound(type) {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different alert types
            const frequencies = {
                'help': 800,
                'defect': 600,
                'stop': 400,
                'maintenance': 1000
            };
            
            oscillator.frequency.value = frequencies[type] || 700;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio playback not supported', e);
        }
    }

    showNotification(message, type) {
        // Simple notification using alert for this version
        // In production, this could be a custom notification system
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    exportData() {
        const data = {
            stations: this.stations,
            alerts: this.alerts,
            exportDate: new Date().toISOString(),
            version: '2.0.0'
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `andon-data-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully', 'success');
    }

    formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    formatDateTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hr ago`;
        
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatAlertType(type) {
        const typeMap = {
            'help': '⚠️ Help Needed',
            'defect': '❌ Defect',
            'stop': '🛑 Line Stop',
            'maintenance': '🔧 Maintenance'
        };
        return typeMap[type] || type;
    }
}

// Initialize the ANDON system when the page loads
let andonSystem;
document.addEventListener('DOMContentLoaded', () => {
    andonSystem = new AndonSystem();
});

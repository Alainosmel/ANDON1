# ANDON System - Revision B

A modern, web-based ANDON system for lean manufacturing environments. This system provides real-time visual and audible alerts for production line issues, enabling rapid response to quality defects, equipment problems, and operator assistance requests.

## 🚀 Features

### Core ANDON Functionality
- **Real-time Status Monitoring**: Visual indicators for 6 production stations
- **Color-Coded Status System**:
  - 🟢 Green: Normal operation
  - 🟡 Yellow: Warning (help needed)
  - 🔴 Red: Critical (defect or line stop)
- **Multiple Alert Types**:
  - ⚠️ Help Needed
  - ❌ Defect Detected
  - 🛑 Line Stop
  - 🔧 Maintenance Required

### Rev B Enhancements
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Data Persistence**: Local storage for alert history and station states
- **Alert Acknowledgment System**: Track when issues are resolved
- **Real-time Statistics Dashboard**:
  - Total alerts count
  - Active alerts monitoring
  - Resolved alerts today
  - Average response time calculation
- **Advanced History Filtering**: Filter by station and alert type
- **Sound Alerts**: Optional audio notifications for new alerts
- **Data Export**: Export alert history and statistics to JSON
- **Professional UI**: Modern gradient design with smooth animations

## 📋 Quick Start

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Alainosmel/ANDON1.git
   cd ANDON1
   ```

2. Open the system:
   ```bash
   # Simply open index.html in your web browser
   # No build process or dependencies required!
   
   # On Linux/Mac:
   open index.html
   
   # On Windows:
   start index.html
   
   # Or use a local web server:
   python3 -m http.server 8000
   # Then navigate to http://localhost:8000
   ```

## 🎯 Usage

### For Operators

1. **Triggering an Alert**:
   - Locate your station card on the dashboard
   - Click the appropriate button for the issue:
     - "Help" - Need supervisor assistance
     - "Defect" - Quality issue detected
     - "Stop" - Line stop required
     - "Maintenance" - Equipment issue

2. **Resolving an Alert**:
   - After the issue is addressed, click "Resolve Issue"
   - The station returns to normal (green) status

### For Supervisors

1. **Monitor Production Line**:
   - Dashboard shows all stations at a glance
   - Color-coded cards indicate station status
   - Pulsing lights on critical alerts

2. **View Statistics**:
   - Total alerts logged
   - Currently active alerts
   - Alerts resolved today
   - Average response time

3. **Review History**:
   - Complete log of all alerts
   - Filter by station or alert type
   - Track response and resolution times

### Control Panel Functions

- **Reset All Stations**: Clear all active alerts (use carefully!)
- **Clear History**: Remove historical alert data
- **Toggle Sound**: Enable/disable audio alerts
- **Export Data**: Download alert data as JSON file

## 🏗️ System Architecture

### File Structure
```
ANDON1/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Core ANDON logic
└── README.md           # This file
```

### Technology Stack
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: No frameworks required
- **LocalStorage API**: Data persistence
- **Web Audio API**: Sound alerts

### Data Model

**Station Object**:
```javascript
{
  id: 1,
  name: "Station A1",
  status: "normal|warning|critical",
  alertTime: "ISO timestamp",
  activeAlertId: 123456789
}
```

**Alert Object**:
```javascript
{
  id: 123456789,
  stationId: 1,
  stationName: "Station A1",
  type: "help|defect|stop|maintenance",
  timestamp: "ISO timestamp",
  status: "active|resolved",
  resolvedAt: "ISO timestamp"
}
```

## 🎨 Customization

### Adding Stations
Edit the `stations` array in `script.js`:
```javascript
this.stations = [
    { id: 1, name: 'Station A1', status: 'normal' },
    { id: 2, name: 'Station A2', status: 'normal' },
    // Add more stations here
];
```

### Changing Colors
Modify CSS variables in `style.css`:
```css
:root {
    --color-success: #10b981;  /* Green */
    --color-warning: #f59e0b;  /* Yellow */
    --color-danger: #ef4444;   /* Red */
    --color-info: #3b82f6;     /* Blue */
}
```

### Alert Types
Add new alert types in both HTML and JavaScript:
1. Add button in `renderStations()` method
2. Add color mapping in CSS
3. Add type formatter in `formatAlertType()`

## 📊 Benefits

- **Reduced Downtime**: Instant visibility of issues
- **Faster Response**: Real-time alerts to supervisors
- **Quality Improvement**: Track and analyze defects
- **Operator Empowerment**: Easy-to-use alert system
- **Data-Driven Decisions**: Historical analytics and reporting
- **Lean Manufacturing**: Supports continuous improvement (Kaizen)

## 🔧 Maintenance

### Data Backup
Export data regularly using the "Export Data" button. This creates a JSON file with:
- All alert history
- Current station states
- Export timestamp
- System version

### Clearing Old Data
Use "Clear History" to remove old alerts. Note: This action is permanent and cannot be undone.

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires modern browser with:
- LocalStorage support
- CSS Grid support
- ES6 JavaScript support

## 🆚 Revision History

### Rev B (Current)
- Modern responsive design
- Local data persistence
- Enhanced statistics dashboard
- Alert history with filtering
- Sound alert system
- Data export functionality
- Mobile-friendly interface
- Professional UI/UX

## 📄 License

This project is open source and available for manufacturing environments.

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Multi-language support
- Database integration
- User authentication
- Email/SMS notifications
- Advanced analytics
- Integration with MES systems

## 📞 Support

For issues or questions, please open an issue in the GitHub repository.

---

**ANDON System Rev B** - Empowering Lean Manufacturing 🏭
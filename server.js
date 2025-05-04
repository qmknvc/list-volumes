// Personal imports
import { hideAllRemovableDrives, restoreAllRemovableDrives } from './handleDrive.js'
import { getDrives } from "./packVolumeList.js";
// Other imports
import express from 'express';
import usbDetect from 'usb-detection';
import open from 'open';
import fs from 'fs';

const port = fs.readFileSync('port.txt', 'utf-8')
const app = express();

app.get('/', (req, res) => {
    res.send('This is your page.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Start monitoring USB devices
usbDetect.startMonitoring();

usbDetect.on('add', async (device) => {
  console.log('USB device plugged in:', device);
  // Hiding drives:
  const drives = await getDrives()
  await hideAllRemovableDrives(drives)

  open(`http://localhost:${port}`);
  // restoreAllRemovableDrives(drives)
});

// Personal imports
import { hideAllRemovableDrives, restoreAllRemovableDrives } from './handleDrive.js'
import { getDrives } from "./packVolumeList.js";
import { saveToDB } from './database/db.js'
// Other imports
import express from 'express';
import usbDetect from 'usb-detection';
import open from 'open';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = parseInt(fs.readFileSync('port.txt', 'utf-8').trim(), 10);
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// End of imports
// Start of code:

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  
  usbDetect.startMonitoring();
});
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

let OPENED_FORM = null
usbDetect.on('add', async (device) => {
  console.log('USB device plugged in:', device);
  // Hiding drives:
  const drives = await getDrives();
  try { await hideAllRemovableDrives(drives);
  } catch (error) {
    console.error("Error in hiding drives: ", error)
  }

  if (OPENED_FORM){
    return
  }
  OPENED_FORM = open(`http://localhost:${port}/form`);
});

app.post('/form', async (req, res) => { 
  // Sending to database:
  const { user_email, user_phone } = req.body;
  console.log("Received data:", user_email, user_phone);
  try { await saveToDB(user_email, user_phone); 
  } catch (error) {
    console.error("Error saving to database: ", error)
    return res.sendStatus(500)
  }
  // Turning off drive:
  console.log("Form filled. Restoring drives...")
  const drives = await getDrives()
  try { await restoreAllRemovableDrives(drives);
  } catch (error) {
    console.error("Error restoring drives: ", error)
    return res.sendStatus(500)
  }
  // Successful:
  res.sendStatus(200);
});

app.get('/form-removed', (req, res) => {
  res.json(OPENED_FORM)
});
usbDetect.on('remove', async () => {
  const drives = await getDrives()
  const removableDrives = drives.filter(drive => drive.type == "Removable");
  if (removableDrives.length > 0){
    console.log("USB drive removed, there's still more removable drives left")
    return
  }
  console.log("All USBs are plugged out.")
  OPENED_FORM = null
});
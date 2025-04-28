import { exec } from 'child_process';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function restoreUSB(driveVolume, driveLetter) {
  // driveVolume = driveVolume.split(' ').join(''); // combined 'Volume5'
  driveVolume = driveVolume.split(' ').pop(); // only '5'
  const scriptContent = `
select volume ${driveVolume}
assign letter=${driveLetter}
`;
  const scriptPath = path.join(__dirname, 'restoreDriveDiskpartScript_${driveLetter}.txt');
  fs.writeFileSync(scriptPath, scriptContent); 

  exec(`diskpart /s "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) console.error(`Error restoring ${driveLetter}:`, error);
    else console.log(`Successfully restored: ${driveLetter}:`, stdout);
    fs.unlink(scriptPath)
  });
}

export { restoreUSB }
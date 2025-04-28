import { exec } from "child_process";
const blockUSB = (driveLetter) => {
    console.log(`Blocking USB: ${driveLetter}...`)
    const hideDriveCommand = `powershell -Command "$Partition = Get-Partition -DriveLetter ${driveLetter}; Remove-PartitionAccessPath -DiskNumber $Partition.DiskNumber -PartitionNumber $Partition.PartitionNumber -AccessPath '${driveLetter}:\\'"`;
    const hideWindowCommand = `powershell -Command `
        + `"Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\AutoplayHandlers' `
        + `-Name 'DisableAutoplay' -Value 1 -Force"`;
        
    exec(hideDriveCommand, (error, stdout, stderr) => {
      if (error) console.error(`Error hiding ${driveLetter}:`, error);
      else console.log(`Successfully hid Drive: ${driveLetter}:`, stdout);
    });
    exec(hideWindowCommand, (error, stdout, stderr) => {
        if (error) console.error(`Error hiding window:`, error);
        else console.log(`Successfully hid window:`, stdout);
      });
}
export { blockUSB }
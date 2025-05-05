import { exec } from "child_process";
const blockUSB = (driveLetter) => {
    console.log(`Blocking USB: ${driveLetter}...`)
    const hideDriveCommand = `powershell -Command "$Partition = Get-Partition -DriveLetter ${driveLetter} -ErrorAction SilentlyContinue; if ($Partition) { Remove-PartitionAccessPath -DiskNumber $Partition.DiskNumber -PartitionNumber $Partition.PartitionNumber -AccessPath '${driveLetter}:\\' -ErrorAction SilentlyContinue }" || exit 0`;
    const hideWindowCommand = `powershell -Command `
        + `"Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\AutoplayHandlers' `
        + `-Name 'DisableAutoplay' -Value 1 -Force"`;
        
    exec(hideDriveCommand, (error, stdout, stderr) => {
      if (error) console.error(`Error hiding ${driveLetter}:`, error);
      else console.log(`Successfully hid Drive: ${driveLetter}:`, stdout);
    });
    exec(hideWindowCommand, (error, stdout, stderr) => {
      if (error) console.error(`Error hiding window:`, error);
    });
}
export { blockUSB }
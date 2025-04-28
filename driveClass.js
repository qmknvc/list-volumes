class Drive {
    constructor(volume, letter, label, fileSystem, type, size, status, info) {
      this.volume = volume;
      this.letter = letter;
      this.label = label;
      this.fileSystem = fileSystem;
      this.type = type;
      this.size = size;
      this.status = status;
      this.info = info;
    }
}

export { Drive }
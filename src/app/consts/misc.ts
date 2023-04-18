import {FileType} from "../model/enum/FileType";

export const id = (() => {
  let currentId = -1;
  const map = new WeakMap();

  return (object: any): number => {
    if (!map.has(object)) {
      map.set(object, ++currentId);
    }

    return map.get(object);
  };
})();


export const getFileType = (file: File): FileType | undefined => {
  const fileName = file.name.toLowerCase();
  const fileType = fileName.split('.').pop();
  switch (fileType) {
    case 'csv':
      return FileType.CSV;
    case 'json':
      return FileType.JSON;
    case 'xml':
      return FileType.XML;
    default:
      return undefined;
  }
}

export const getFileTypeString = (file: File): string | undefined => {
  const fileName = file.name.toLowerCase();
  const fileType = fileName.split('.').pop();
  return fileType?.toUpperCase()
}

export const getFileSizeString = (file: File): string => {
  let fileSizeInBytes = file.size;
  const units = ["B", "KB", "MB", "GB", "TB"];

  let i = 0;
  while (fileSizeInBytes >= 1024 && i < units.length - 1) {
    fileSizeInBytes /= 1024;
    i++;
  }

  return fileSizeInBytes.toFixed(2) + " " + units[i];
}

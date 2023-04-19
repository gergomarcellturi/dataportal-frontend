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

const units = ["B", "KB", "MB", "GB", "TB"];
export const getFileSizeStringFromFile = (file: File): string => {
  let fileSizeInBytes = file.size;

  let i = 0;
  while (fileSizeInBytes >= 1024 && i < units.length - 1) {
    fileSizeInBytes /= 1024;
    i++;
  }

  return fileSizeInBytes.toFixed(2) + " " + units[i];
}

export const getFileSizeStringFromSize = (fileSizeInBytes: number): string => {
  let i = 0;
  while (fileSizeInBytes >= 1024 && i < units.length - 1) {
    fileSizeInBytes /= 1024;
    i++;
  }

  return fileSizeInBytes.toFixed(2) + " " + units[i];
}

export const ckeditorConfig: any = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'alignment',
      '|',
      'indent',
      'outdent',
      '|',
      'link',
      'unlink',
      '|',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      '|',
      'undo',
      'redo',
      '|',
      'code',
      'codeBlock',
      '|',
      'removeFormat',
      '|',
      'horizontalLine',
      'specialCharacters',
      'pageBreak',
    ],
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyle:alignLeft',
      'imageStyle:full',
      'imageStyle:alignRight',
      'imageStyle:alignCenter',
      '|',
      'linkImage',
    ],
    styles: [
      'full',
      'alignLeft',
      'alignRight',
      'alignCenter',
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
};


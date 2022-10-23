import type { SupplyFiles } from '@/@types/additional';

interface FilesTabs {
  type: keyof SupplyFiles;
  fileTypes: string;
}

const allowedFiles =
  '.pdf, .csv, image/*, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const FILES_TABS: FilesTabs[] = [
  { type: 'ci', fileTypes: allowedFiles },
  { type: 'pl', fileTypes: allowedFiles },
  { type: 'hbl', fileTypes: allowedFiles },
  { type: 'photo', fileTypes: '.pdf, image/*,' },
  { type: 'pay', fileTypes: allowedFiles },
];

export default FILES_TABS;

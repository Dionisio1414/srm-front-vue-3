import { utils, writeFile } from 'xlsx';

interface ExportTableData {
  exportData: (id: string) => void;
}

function exportTableData(): ExportTableData {
  const exportData = (id: string) => {
    const wb = utils.table_to_book(document.getElementById(id), { raw: true });

    writeFile(wb, `${id}.xlsx`);
  };

  return { exportData };
}

export type { ExportTableData };
export default exportTableData;

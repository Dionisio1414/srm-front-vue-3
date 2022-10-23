import type { TableField } from '@/@types/table';

const SUPPLIER_MAILS_FIELDS: TableField[] = [
  { title: 'supplierMails.table.name', name: 'name', default: true, sortKey: 'name', key: 'name' },
  { title: 'supplierMails.table.id', name: 'id', default: true, sortKey: 'aws_id', key: 'awsId' },
  {
    title: 'supplierMails.table.email',
    name: 'email',
    default: true,
    sortKey: 'general_email',
    key: 'email',
  },
  {
    title: 'supplierMails.table.mails',
    name: 'mails',
    default: true,
    sortKey: 'is_mail_approved',
    key: 'isMailApproved',
  },
];

const STORAGE_KEY = 'SUPPLIER_MAILS_COLUMNS';

export { SUPPLIER_MAILS_FIELDS, STORAGE_KEY };

import httpClient from '@/app/shared/services/http-client';
import ApiConstants from '@/app/supplier-mails/shared/config/api-constants';

import type { SupplierMails } from '@/@types/mails';
import type { Sort, PageFilter, Filter } from '@/@types/table';

async function getMailsList<T = { data: SupplierMails[]; items_count: number }>(
  params: Sort & PageFilter & Filter
): Promise<T> {
  const response = await httpClient.get(ApiConstants.GET_MAILS_LIST, { params });

  return response.data;
}

async function changeMailStatus<T = { message: string; success: boolean }>(
  params: {
    is_mail_approved: boolean;
  },
  guid: string
): Promise<T> {
  const response = await httpClient.put(
    ApiConstants.CHANGE_MAIL_STATUS.replace('{guid}', guid),
    params
  );

  return response.data;
}

export { getMailsList, changeMailStatus };

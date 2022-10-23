<template>
  <data-table
    id="compare-results"
    :value="data.general_fields"
    striped-rows
    removable-sort
    responsive-layout="scroll"
  >
    <column-group type="header">
      <row>
        <column
          :header="isSupply ? $t('parsing.table.articleNumber') : $t('parsing.table.product')"
          :rowspan="2"
        />
        <column
          :header="
            isSupply
              ? $t('parsing.table.supply', { number: supplyNumber })
              : $t('parsing.table.originalOrder')
          "
          :colspan="isSupply ? 3 : 4"
        />
        <column
          :header="
            isSupply ? $t('parsing.table.file', { name: fileName }) : $t('parsing.table.filesData')
          "
          :colspan="isSupply ? 3 : 4"
        />
      </row>

      <row>
        <column v-if="!isSupply" header="OEM" sortable field="from_order.oem" />
        <column :header="$t('parsing.table.qty')" sortable field="from_order.quantity" />
        <column :header="$t('parsing.table.price')" sortable field="from_order.price_usd" />
        <column :header="$t('parsing.table.fid')" sortable field="from_order.fid" />

        <column v-if="!isSupply" header="OEM" sortable field="from_file.oem" />
        <column :header="$t('parsing.table.qty')" sortable field="from_file.quantity" />
        <column :header="$t('parsing.table.price')" sortable field="from_file.price_usd" />
        <column :header="$t('parsing.table.fid')" sortable field="from_file.fid" />
      </row>
    </column-group>

    <column field="from_file.article_no" :header="$t('parsing.table.product')">
      <template #body="{ data }">
        {{ data[generalKey].article_no || data.from_file.article_no }}
      </template>
    </column>

    <column v-if="!isSupply" field="from_order.oem" header="OEM">
      <template #body="{ data }">
        {{ data[generalKey].oem || '—' }}
      </template>
    </column>

    <column field="from_order.quantity" :header="$t('parsing.table.qty')">
      <template #body="{ data }">
        {{ data[generalKey].quantity || '—' }}
      </template>
    </column>

    <column field="from_order.price_usd" :header="$t('parsing.table.price')">
      <template #body="{ data }">
        {{ data[generalKey].price_usd ? formatCurrency(Number(data[generalKey].price_usd)) : '—' }}
      </template>
    </column>

    <column field="from_order.fid" :header="$t('parsing.table.fid')">
      <template #body="{ data }">
        {{ data[generalKey].fid || '—' }}
      </template>
    </column>

    <column v-if="!isSupply" field="from_file.oem" header="OEM">
      <template #body="{ data }">
        {{ data.from_file.oem || '—' }}
      </template>
    </column>

    <column field="from_file.quantity" :header="$t('parsing.table.qty')">
      <template #body="{ data }">
        {{ data.from_file.quantity || '—' }}
      </template>
    </column>

    <column field="from_file.price_usd" :header="$t('parsing.table.price')">
      <template #body="{ data }">
        {{ data.from_file.price_usd ? formatCurrency(Number(data.from_file.price_usd)) : '—' }}
      </template>
    </column>

    <column field="from_file.fid" :header="$t('parsing.table.fid')">
      <template #body="{ data }">
        {{ data.from_file.fid || '—' }}
      </template>
    </column>

    <column-group type="footer">
      <row>
        <column
          :footer="$t('parsing.table.total')"
          :colspan="isSupply ? 2 : 3"
          footer-style="text-align: center"
        />
        <column
          :footer="formatCurrency(Number(data.custom_fields[generalKey].total_price_usd))"
          :colspan="isSupply ? 3 : 4"
        />
        <column
          :footer="formatCurrency(Number(data.custom_fields.from_file.total_price_usd))"
          :colspan="2"
        />
      </row>
    </column-group>
  </data-table>

  <div class="flex justify-content-end mt-5">
    <prime-button type="button" @click="exportData('compare-results')" class="ml-3">
      <font-awesome-icon icon="download" size="xl" />

      <span class="ml-2 text-lg font-bold">{{ $t('parsing.buttons.downloadXLSX') }}</span>
    </prime-button>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import DataTable from 'primevue/datatable';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Column from 'primevue/column';
import PrimeButton from 'primevue/button';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import useExportTableData from '@/app/shared/services/hooks/export-table-data';

import { formatCurrency } from '@/app/shared/services/helpers/table-helpers';

import type { CompareData } from '@/@types/additional';

library.add(faDownload);

defineProps({
  isSupply: { type: Boolean, required: true },
  generalKey: { type: String, required: true },
  supplyNumber: { type: String, required: true },
  fileName: { type: String, required: true },
  data: { type: Object as PropType<CompareData>, required: true },
});

const { exportData } = useExportTableData();
</script>

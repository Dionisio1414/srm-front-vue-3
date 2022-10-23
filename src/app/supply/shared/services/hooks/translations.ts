import { useI18n } from 'vue-i18n';

interface Translations {
  getScenarioTranslate: (alias: string, path: string, params?: { [key: string]: string }) => string;
}

function translations(): Translations {
  const { t } = useI18n();

  const getScenarioTranslate = (alias: string, path: string, params?: { [key: string]: string }) =>
    t(`supply.statusHistory.statusesScenario.${alias}.${path}`, params || {});

  return { getScenarioTranslate };
}

export default translations;

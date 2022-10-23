import { useI18n } from 'vue-i18n';

interface Translates {
  getScenarioTranslate: (alias: string, path: string) => string;
  getCommentTranslate: (alias: string, path: string) => string;
}

function translates(): Translates {
  const { t: $t } = useI18n();

  const getScenarioTranslate = (alias: string, path: string): string => {
    const formattedAlias = alias.replace(/Green|Red|Yellow/gm, '');
    const aliasName = formattedAlias.includes('production') ? 'production' : formattedAlias;

    return $t(`order.statusesScenario.${aliasName}.${path}`);
  };

  const getCommentTranslate = (alias: string, path: string): string =>
    $t(`order.commentBlock.${alias}.${path}`);

  return { getScenarioTranslate, getCommentTranslate };
}

export default translates;

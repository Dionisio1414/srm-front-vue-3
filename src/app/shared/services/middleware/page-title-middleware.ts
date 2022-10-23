import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const setPageTitleMiddleware = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: () => void
): void => {
  const pageTitle = to.matched.find((item: RouteRecordRaw) => item.meta?.title);

  if (pageTitle) window.document.title = (pageTitle.meta.title as string) || '';

  next();
};

export default setPageTitleMiddleware;

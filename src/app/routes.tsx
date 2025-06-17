import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Archive } from '@app/Archive/Archive';
import { View } from '@app/View/View';
import { Create } from '@app/Create/Create';
import { NotFound } from '@app/NotFound/NotFound';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  element?: React.ReactElement;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Dashboard />,
    exact: true,
    label: 'Dashboard',
    path: '/',
    title: 'OpenShift Partner Labs | Home',
  },
  {
    element: <View />,
    exact: true,
    label: 'View',
    path: '/view',
    title: 'OpenShift Partner Labs | View'
  },
  {
    element: <Create />,
    exact: true,
    label: 'Create',
    path: '/create',
    title: 'OpenShift Partner Labs | Create',
  },
  {
    exact: true,
    label: 'Docs',
    path: 'https://redhat-connect.gitbook.io/red-hat-partner-lab-quickstart-guide',
    title: 'OpenShift Partner Labs | Docs',
  },
  {
    element: <Archive />,
    exact: true,
    label: 'Archive',
    path: '/archive',
    title: 'OpenShift Partner Labs | Archive',
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };

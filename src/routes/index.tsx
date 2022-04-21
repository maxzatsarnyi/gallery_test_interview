import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const Homepage = lazy(() => import('../pages/Homepage'));

export const Routes = () => {
  const routeConfig = useRoutes([{ path: `/`, element: <Homepage /> }]);
  return <>{routeConfig}</>;
};

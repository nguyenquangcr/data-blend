import React from 'react';
import routes, { renderRoutes } from '~/routes';

function RouteComponent() {
  return <>{renderRoutes(routes)}</>;
}

export default RouteComponent;

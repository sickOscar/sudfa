import ReactDOM from 'react-dom';
import './index.scss';

import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();

ReactDOM.render(
  routes,
  document.getElementById('root')
);

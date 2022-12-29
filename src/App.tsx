import type { RouteObject } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import "./assets/styles/ant.custom.less";
import styles from "styles/app.module.less";
import Home from "./pages/Home";
const routers: RouteObject[] = [{ path: "/", element: <Home /> }];
const App: React.FC = () => {
  const elements = useRoutes(routers);
  return <div className={styles.app}>{elements}</div>;
};

export default App;

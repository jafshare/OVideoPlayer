import "./assets/styles/ant.custom.less";
import styles from "styles/app.module.less";
import Home from "./pages/Home";
const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Home />
    </div>
  );
};

export default App;

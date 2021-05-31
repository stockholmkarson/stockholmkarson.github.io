import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./appRouter";
import CosmicContext from "./contexts/CosmicContext";
import "./styles/reset.css";
import "./styles/font.css";
import "./styles/nav.scss";
import "./styles/global.scss";

const root = document.createElement("div");
root.id = "app";
document.body.appendChild(root);

const App = () => {
  const [bucket, setBucket] = React.useState(null);

  React.useEffect(() => {
    const Cosmic = require("cosmicjs");
    const api = Cosmic();

    const bucket = api.bucket({
      slug: "karson-disc-golf-club",
      read_key: "M1s1OM3TDCkbJeypzPQPifD1RBz23D7WiZ9zNMChMwTiSM8ebi",
    });
    setBucket(bucket);
  }, []);
    return (
      <CosmicContext.Provider value={{ bucket: bucket }}>
        <AppRouter />
      </CosmicContext.Provider>
    );
};
if ((module as any).hot) {
  (module as any).hot.accept(".", function () {});
}

ReactDOM.render(<App />, document.getElementById("app"));

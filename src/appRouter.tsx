import React from "react";
import { Switch, Route, Link, HashRouter } from "react-router-dom";
import CosmicContext from "./contexts/CosmicContext";
import Course from "./routes/course";
import GeneralPage from "./routes/general/index";
import Home from "./routes/home/index";
import Results from "./routes/results/index";

const AppRouter = () => {
  const { bucket } = React.useContext(CosmicContext);
  const [pages, setPages] = React.useState([]);
  React.useEffect(() => {
    if (bucket) {
      const getPages = async () => {
        const response = await bucket.getObjects({
          type: "pages",
          props: "metadata,content,slug",
        });
        setPages(response.objects);
      };
      getPages();
    }
  }, [bucket]);
  return (
    <HashRouter basename={"/"}>
      <div>
        <nav>
          <ul>
            {pages
              .filter((p) => p.metadata["include_in_navigation"])
              .map((p) => (
                <li key={`list_item_${p.metadata["navigation_title"]}`}>
                  <Link to={p.slug}>{p.metadata["navigation_title"]}</Link>
                </li>
              ))}
          </ul>
        </nav>
        <div className="content-container">
          <Switch>
            {pages
              .filter((p) => !p.metadata["included_in_code_base"])
              .map((p) => (
                <Route
                  key={`route_${p.metadata["navigation_title"]}`}
                  path={"/" + p.slug}>
                  <GeneralPage slug={p.slug} />
                </Route>
              ))}
            <Route component={Results} path="/touren"></Route>
            <Route component={Course} path="/banan"></Route>
            <Route>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
};

export default AppRouter;

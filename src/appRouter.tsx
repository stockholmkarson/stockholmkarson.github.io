import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CosmicContext from "./contexts/CosmicContext";
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
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <nav>
          <ul>
            {pages
              .filter((p) => p.metadata["include_in_navigation"])
              .map((p) => (
                <li>
                  <Link
                    to={(p.metadata["navigation_title"] as string)
                      ?.replace(" ", "-")
                      .toLowerCase()}>
                    {p.metadata["navigation_title"]}
                  </Link>
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
                  path={
                    "/" +
                    (p.metadata["navigation_title"] as string)
                      ?.replace(" ", "-")
                      .toLowerCase()
                  }>
                  <GeneralPage slug={p.slug} />
                </Route>
              ))}
            <Route component={Results} path="/resultat"></Route>
            <Route>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;

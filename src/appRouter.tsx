import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CosmicContext from "./contexts/CosmicContext";
import GeneralPage from "./routes/general/index";
import Home from "./routes/home/index";

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
        console.log(response);
        setPages(response.objects);
      };
      getPages();
    }
  }, [bucket]);
  return (
    <Router>
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
          <Route>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;

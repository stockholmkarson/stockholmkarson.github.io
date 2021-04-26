import React from "react";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from "../../../node_modules/@fortawesome/free-solid-svg-icons/index";
import { FontAwesomeIcon } from "../../../node_modules/@fortawesome/react-fontawesome/index";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import DiscgolfMetrixResponse, {
  DiscgolfMetrixResult,
} from "../../types/DiscgolfMetrixCompetition";
import "./index.css";

const Results = () => {
  const [results, setResults] = React.useState<
    FilteredDisplayResults[] | undefined
  >(undefined);

  const [fetching, setFetching] = React.useState(false);

  const [indexesToExpand, setIndexesToExpand] = React.useState<number[]>([0]);
  const [usersToExpand, setUsersToExpand] = React.useState<
    { userId: string; index: number }[]
  >([]);

  const { width, height } = useWindowDimensions();

  React.useEffect(() => {
    const getResults = async () => {
      const lastYear = await getEvent("1208269");
      const thisYear = await getEvent("1622475");
      setResults([thisYear, lastYear]);
      setFetching(false);
    };
    getResults();
  }, []);

  const getEvent = async (id: string) => {
    const response = await fetch(
      "https://discgolfmetrix.com/api.php?content=result&id=" + id
    );
    const data = (await response.json()) as DiscgolfMetrixResponse;
    let eventDatas: DiscgolfMetrixResult[] = [];
    const eventDataPromises: Promise<any>[] = [];

    for (let event of data.Competition.Events) {
      eventDataPromises.push(getEventData(event.ID));
    }
    const results = await Promise.all<DiscgolfMetrixResponse>(
      eventDataPromises
    );
    for (let result of results) {
      eventDatas = eventDatas.concat(result.Competition.Results);
    }
    const divisionResults = eventDatas.reduce((dr, r) => {
      dr = {
        ...dr,
        [r.ClassName]: {
          ...dr[r.ClassName],
          [r.UserID]: dr[r.ClassName]?.[r.UserID]
            ? [...dr[r.ClassName][r.UserID], r]
            : [r],
        },
      };
      return dr;
    }, {} as DisplayResults);
    const filteredResults: FilteredDisplayResults = {};
    Object.keys(divisionResults).forEach((className) => {
      Object.keys(divisionResults[className]).forEach((userId) => {
        if (!filteredResults[className]) {
          filteredResults[className] = {};
        }
        const results = divisionResults[className][userId]
          .sort((a, b) => a.Diff - b.Diff)
          .slice(0, 8);
        filteredResults[className][userId] = {
          results,
          finalScore: results.reduce((a, b) => (a += b.Diff), 0),
          name: divisionResults[className][userId][0].Name,
        };
      });
    });
    return filteredResults;
  };

  const getEventData = async (id: string) => {
    try {
      const eventResponse = await fetch(
        "https://discgolfmetrix.com/api.php?content=result&id=" + id
      );
      return await eventResponse.json();
    } catch (e) {
      console.log(e);
    }
  };
  const toggleTable = (index: number) => {
    if (indexesToExpand.includes(index)) {
      setIndexesToExpand(indexesToExpand.filter((i) => i !== index));
    } else {
      setIndexesToExpand(indexesToExpand.concat(index));
    }
  };

  const toggleExpandResults = (userId: string, index: number) => {
    const idx = usersToExpand.findIndex(
      (ute) => ute.userId === userId && ute.index === index
    );
    if (idx !== -1) {
      const newUsers = usersToExpand
        .slice(0, idx)
        .concat(usersToExpand.slice(idx + 1, usersToExpand.length));
      setUsersToExpand(newUsers);
    } else {
      setUsersToExpand(usersToExpand.concat({ userId, index }));
    }
  };

  if (fetching) {
    return null;
  }

  return (
    <div>
      <h1>Resultat</h1>
      {results &&
        results.map((r, i) => (
          <div className="result-table">
            <h2 onClick={() => toggleTable(i)} className="result-table-header">
              {i === 0 ? "Kärsötouren 2021" : "Kärsötouren 2020"}
              <FontAwesomeIcon
                className="result-table-toggle"
                icon={
                  indexesToExpand.includes(i) ? faChevronDown : faChevronRight
                }
                size={"sm"}
              />
            </h2>
            {indexesToExpand.includes(i)
              ? Object.keys(r).map((className) => (
                  <>
                    <h3>{className.toUpperCase()}</h3>
                    <div className="result-class">
                      <div className="result-class-grid">
                        <span
                          style={{
                            textAlign: "right",
                            fontWeight: "bold",
                            fontSize: "1.1em",
                          }}>
                          Nr
                        </span>
                        <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                          Namn
                        </span>
                        {width > 480 &&
                          Array(8)
                            .fill(1)
                            .map((a, index) => (
                              <span
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontSize: "1.1em",
                                }}>
                                {index + 1}
                              </span>
                            ))}
                        <span
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1.1em",
                          }}>
                          Summa
                        </span>
                      </div>
                      {Object.entries(r[className])
                        .filter(([, a]) => a.results.length)
                        .sort(([, a], [, b]) => {
                          if (a.results.length > b.results.length) return -1;
                          if (b.results.length > a.results.length) return 1;

                          if (b.finalScore > a.finalScore) {
                            return -1;
                          }
                          if (a.finalScore > b.finalScore) {
                            return 1;
                          }
                          return 0;
                        })
                        .map(([userId, userData], index) => {
                          return (
                            <>
                              <div
                                onClick={() =>
                                  width <= 480
                                    ? toggleExpandResults(userId, i)
                                    : {}
                                }
                                className={`result-class-grid ${
                                  usersToExpand.some(
                                    (u) => u.index === i && u.userId === userId
                                  )
                                    ? "expanded"
                                    : ""
                                }`}>
                                {width <= 480 && (
                                  <FontAwesomeIcon
                                    style={{
                                      position: "absolute",
                                      left: "6px",
                                      top: "50%",
                                      transform: "translateY(-70%)",
                                    }}
                                    size={"xs"}
                                    icon={
                                      usersToExpand.some(
                                        (u) =>
                                          u.index === i && u.userId === userId
                                      )
                                        ? faChevronDown
                                        : faChevronRight
                                    }
                                  />
                                )}
                                <span style={{ textAlign: "right" }}>
                                  {index + 1}
                                </span>
                                <span>{userData.name}</span>
                                {width > 480 &&
                                  Array(8)
                                    .fill(1)
                                    .map((a, index) => (
                                      <span style={{ textAlign: "center" }}>
                                        {userData.results[index]?.Diff > 0
                                          ? "+"
                                          : ""}
                                        {userData.results[index]?.Diff ?? ""}
                                      </span>
                                    ))}
                                <span
                                  style={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}>
                                  {userData.finalScore > 0 ? "+" : ""}
                                  {userData.finalScore}
                                </span>
                              </div>
                              {width <= 480 &&
                              usersToExpand.some(
                                (u) => u.index === i && u.userId === userId
                              ) ? (
                                <div className="result-class-grid-mobile-results">
                                  {Array(8)
                                    .fill(1)
                                    .map((a, index) => (
                                      <span style={{ textAlign: "center" }}>
                                        {userData.results[index]?.Diff > 0
                                          ? "+"
                                          : ""}
                                        {userData.results[index]?.Diff ?? ""}
                                      </span>
                                    ))}
                                </div>
                              ) : null}
                            </>
                          );
                        })}
                    </div>
                  </>
                ))
              : null}
          </div>
        ))}
    </div>
  );
};

interface DisplayResults {
  [key: string]: { [key: string]: DiscgolfMetrixResult[] };
}

interface FilteredDisplayResults {
  [key: string]: { [key: string]: Results };
}

interface Results {
  finalScore: number;
  name: string;
  results: DiscgolfMetrixResult[];
}

export default Results;

import React from "react";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
} from "../../../node_modules/@fortawesome/free-solid-svg-icons/index";
import { FontAwesomeIcon } from "../../../node_modules/@fortawesome/react-fontawesome/index";
import Spinner from "../../components/Spinner/Spinner";
import CosmicContext, { CosmicObject } from "../../contexts/CosmicContext";
import useBucketData from "../../hooks/useBucketData";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import DiscgolfMetrixResponse, {
  DiscgolfMetrixResult,
} from "../../types/DiscgolfMetrixCompetition";
import "./index.css";

interface ResultsPageMetadata {
  discgolfmetrix_competition_ids: string;
}

const Results = () => {
  const [results, setResults] = React.useState<
    FilteredDisplayResults[] | undefined
  >(undefined);

  const [fetching, setFetching] = React.useState(true);

  const { bucket } = React.useContext(CosmicContext);
  const { data, dataFetched } = useBucketData(bucket, "608587c9b84bb600082338a3");

  const [indexesToExpand, setIndexesToExpand] = React.useState<number[]>([0]);
  const [usersToExpand, setUsersToExpand] = React.useState<
    { userId: string; index: number }[]
  >([]);

  const { width, height } = useWindowDimensions();

  React.useEffect(() => {
    if (data && data.metadata.discgolfmetrix_competition_ids) {
      const getResults = async () => {
        const competitionIds = data.metadata.discgolfmetrix_competition_ids.split(
          ","
        );
        const allResults = [];
        for (let competitionId of competitionIds) {
          const competitionResults = await getEvent(competitionId);
          allResults.push(competitionResults);
        }
        setResults(allResults);
        setFetching(false);
      };
      getResults();
    }
  }, [data]);

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

    const filteredResults: FilteredDisplayResults = {
      name: data.Competition.Name,
      resultsByClass: {},
    };
    Object.keys(divisionResults).forEach((className) => {
      Object.keys(divisionResults[className]).forEach((userId) => {
        if (!filteredResults.resultsByClass[className]) {
          filteredResults.resultsByClass[className] = {};
        }
        const results = divisionResults[className][userId]
          .sort((a, b) => a.Diff - b.Diff)
          .slice(0, 8);
        filteredResults.resultsByClass[className][userId] = {
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

  if (!dataFetched) {
    return null;
  }

  return (
    <div className="results">
      <h1>{data.title}</h1>
      <div
        className="bag-content-container"
        dangerouslySetInnerHTML={{ __html: data.content }}></div>
      <div></div>
      {fetching && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}>
          <Spinner />
        </div>
      )}
      {!fetching ? (
        results ? (
          results.map((r, i) => (
            <div key={`result_table_${i}`} className="result-table">
              <h2
                onClick={() => toggleTable(i)}
                className="result-table-header">
                {r.name}
                <FontAwesomeIcon
                  className="result-table-toggle"
                  icon={
                    indexesToExpand.includes(i) ? faChevronDown : faChevronRight
                  }
                  size={"sm"}
                />
              </h2>
              {indexesToExpand.includes(i)
                ? Object.keys(r.resultsByClass).map((className) => (
                    <div key={`result_class_${className}_${i}`}>
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
                          <span
                            style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                            Namn
                          </span>
                          {width > 480 &&
                            Array(8)
                              .fill(1)
                              .map((a, index) => (
                                <span
                                  key={`result_${index}_${i}`}
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
                        {Object.entries(r.resultsByClass[className])
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
                              <div
                                key={`result_user_${userId}_${className}_${i}`}>
                                <div
                                  onClick={() =>
                                    width <= 480
                                      ? toggleExpandResults(userId, i)
                                      : {}
                                  }
                                  className={`result-class-grid ${
                                    usersToExpand.some(
                                      (u) =>
                                        u.index === i && u.userId === userId
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
                                        <span
                                          key={`result_user_${userId}_${index}_${i}`}
                                          style={{ textAlign: "center" }}>
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
                                        <span
                                          key={`result_mobile_${i}_${userId}_${className}_${index}`}
                                          className="result-class-grid-mobile-results-result">
                                          <span>
                                            {userData.results[index]?.Diff > 0
                                              ? "+"
                                              : ""}
                                            {userData.results[index]?.Diff ??
                                              ""}
                                          </span>
                                        </span>
                                      ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))
                : null}
            </div>
          ))
        ) : (
          <h2>No results found</h2>
        )
      ) : null}
    </div>
  );
};

interface DisplayResults {
  [key: string]: { [key: string]: DiscgolfMetrixResult[] };
}

interface FilteredDisplayResults {
  name: string;
  resultsByClass: { [key: string]: { [key: string]: Results } };
}

interface Results {
  finalScore: number;
  name: string;
  results: DiscgolfMetrixResult[];
}

export default Results;

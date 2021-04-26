import React from "react";
import Spinner from "../../components/Spinner/Spinner";
import CosmicContext, { CosmicObject } from "../../contexts/CosmicContext";
import useBucketData from "../../hooks/useBucketData";
import DiscgolfMetrixResponse, {
  DiscgolfMetrixResult,
} from "../../types/DiscgolfMetrixCompetition";
import DiscgolfMetrixCompetition from "../../types/DiscgolfMetrixCompetition";
import "./index.css";

interface HomePageMetadata {
  news_content: string;
  news_header: string;
  news_subheader: string;
}

const Home = () => {
  const { bucket } = React.useContext(CosmicContext);
  const { data: pageData, dataFetched } = useBucketData(bucket, "home");

  return (
    <div>
      {pageData?.metadata.news_header ||
      pageData?.metadata.news_subheader ||
      pageData?.metadata.news_content ? (
        <div className="news-container">
          <h1>{pageData.metadata.news_header}</h1>
          <p>{pageData.metadata.news_subheader}</p>
          <p>{pageData.metadata.news_content}</p>
        </div>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: pageData?.content }}></div>
    </div>
  );
};

export default Home;

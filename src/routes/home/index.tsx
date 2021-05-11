import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CosmicContext from "../../contexts/CosmicContext";
import useBucketData from "../../hooks/useBucketData";
import "./index.scss";

interface HomePageMetadata {
  news_content: string;
  news_header: string;
  news_subheader: string;
  cover_image: any;
  alert_content: string;
}

const Home = () => {
  const { bucket } = React.useContext(CosmicContext);
  const { data: pageData, dataFetched } = useBucketData<HomePageMetadata>(
    bucket,
    "home"
  );

  if (!dataFetched) {
    return null;
  }

  return (
    <div>
      <div className="cover_image_container">
        <img className="cover_image" src={pageData.metadata.cover_image.url} />
      </div>
      <h1>{pageData.title}</h1>
      {pageData?.metadata.news_heading ||
      pageData?.metadata.news_subheader ||
      pageData?.metadata.news_content ? (
        <div className="bag-content-container alert-container">
          {pageData.metadata.news_heading && (
            <h4>{pageData.metadata.news_heading}</h4>
          )}
          {pageData.metadata.alert_content && (
            <div
              dangerouslySetInnerHTML={{
                __html: pageData.metadata.alert_content,
              }}
            />
          )}
        </div>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: pageData?.content }}></div>
    </div>
  );
};

export default Home;

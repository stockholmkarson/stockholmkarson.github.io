import React, { useContext } from "react";
import CosmicContext from "../../contexts/CosmicContext";
import useBucketData from "../../hooks/useBucketData";
import "./index.scss";
import CourseImage from "../../resources/course.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const Course = () => {
  const { bucket } = useContext(CosmicContext);
  const { data, dataFetched } = useBucketData(bucket, "banan");
  if (!dataFetched) {
    return null;
  }
  return (
    <div className="course-content">
      <h1>{data.title}</h1>
      <div
        className="bag-content-container"
        dangerouslySetInnerHTML={{ __html: data.content }}></div>
      <div>
        <h2>Bankarta</h2>
        <a
          className="course-info-image-download"
          download="karson_bankarta.png"
          href={CourseImage}>
          <FontAwesomeIcon icon={faDownload} style={{ marginRight: "8px" }} />
          Ladda ner bankarta
        </a>
        <img className="course-info-image" src={CourseImage} />
      </div>
    </div>
  );
};

export default Course;

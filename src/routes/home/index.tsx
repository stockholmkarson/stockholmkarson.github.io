import React from "react";
import Spinner from "../../components/Spinner/Spinner";
import CosmicContext, { Object } from "../../contexts/CosmicContext";
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
  const [data, setData] = React.useState<Object<HomePageMetadata> | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (bucket) {
      const fetchBlog = async () => {
        const data = await bucket.getObject<HomePageMetadata>({
          slug: "home",
          props: "slug,title,content,metadata", // Limit the API response data by props
        });
        setData(data.object);
      };
      fetchBlog();
    }
  }, [bucket]);

  return (
    <div>
      {data?.metadata.news_header ||
      data?.metadata.news_subheader ||
      data?.metadata.news_content ? (
        <div className="news-container">
          <h1>{data.metadata.news_header}</h1>
          <p>{data.metadata.news_subheader}</p>
          <p>{data.metadata.news_content}</p>
        </div>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: data?.content }}></div>
    </div>
  );
};

export default Home;

import React from "react";
import CosmicContext from "../../contexts/CosmicContext";

interface HomePageMetadata {}

const Home = () => {
  const { bucket } = React.useContext(CosmicContext);
  const [data, setData] = React.useState(undefined);

  React.useEffect(() => {
    if (bucket) {
      const fetchBlog = async () => {
        const data = await bucket.getObject<HomePageMetadata>({
          slug: "home",
          props: "slug,title,content,metadata", // Limit the API response data by props
        });
        setData(data.object);
        console.log(data.object);
      };
      fetchBlog();
    }
  }, [bucket]);

  return (
    <div>
      <h1>{data?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.content }}></div>
    </div>
  );
};

export default Home;

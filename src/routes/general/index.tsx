import React from "react";
import CosmicContext from "../../contexts/CosmicContext";

const GeneralPage = ({ slug }: { slug: string }) => {
  const { bucket } = React.useContext(CosmicContext);
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (bucket) {
      const fetchBlog = async () => {
        const data = await bucket.getObject({
          slug,
          props: "title,content",
        });
        setData(data.object);
        console.log(data.object);
      };
      fetchBlog();
    }
  }, [bucket]);

  return data ? (
    <div>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data?.content }}></div>
    </div>
  ) : (
    <p>laddar...</p>
  );
};

export default GeneralPage;

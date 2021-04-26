import React from "react";
import { Bucket, CosmicObject } from "../contexts/CosmicContext";

export default function useBucketData<T>(bucket: Bucket, slug: string) {
  const [data, setData] = React.useState<CosmicObject<T> | undefined>(
    undefined
  );
  const [dataFetched, setDataFetched] = React.useState(false);
  React.useEffect(() => {
    if (bucket) {
      const fetchBlog = async () => {
        const data = await bucket.getObject<T>({
          slug,
          props: "slug,title,content,metadata", // Limit the API response data by props
        });
        setData(data.object);
        setDataFetched(true);
      };
      fetchBlog();
    }
  }, [bucket]);

  return { data, dataFetched };
}

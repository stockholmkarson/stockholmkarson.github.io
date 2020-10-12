import React from "react";

const CosmicContext = React.createContext<ICosmicContext>({
  bucket: undefined,
});

interface ICosmicContext {
  bucket: Bucket;
}

interface Bucket {
  getObject: <T = any>(props: GetObjectProps) => ObjectResponse<T>;
  getObjects: (props: GetObjectsProps) => any;
}

interface GetObjectsProps {
  type: string;
  props: string;
}

interface GetObjectProps {
  slug: string;
  props: string;
  [key: string]: any;
}

interface ObjectResponse<T = any> {
  object: Object<T>;
}

interface Object<T = any> {
  title: string;
  metadata: T & { [key: string]: any };
}

export default CosmicContext;

import React from "react";
import ReactMarkdown from "react-markdown";
import { Champion } from "../Champion/Champion";
import { Item } from "../Item/Item";
import CustomMark from "./CustomMark";

interface MarkdownViewerProps {
  readonly value: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ value }) => {
  const renderers = {
    customMark: (props: any) => {
      if (props.identifier.toLowerCase() === "champion") {
        return <Champion championKey={props.param} showItems={false} />;
      }
      if (props.identifier.toLowerCase() === "item") {
        return <Item itemId={props.param} />;
      }
      return <>{`[[${props.identifier}]]`}</>;
    }
  };
  const plugins = [CustomMark];
  return (
    <ReactMarkdown source={value} renderers={renderers} plugins={plugins} />
  );
};

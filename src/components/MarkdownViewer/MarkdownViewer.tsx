import React from "react";
import ReactMarkdown from "react-markdown";
import { ChampionPill } from "../ChampionPill/ChampionPill";
import { ItemPill } from "../ItemPill/ItemPill";
import { TraitPill } from "../TraitPill/TraitPill";
import CustomMark from "./CustomMark";

interface MarkdownViewerProps {
  readonly value: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ value }) => {
  const renderers = {
    customMark: (props: any) => {
      if (props.identifier.toLowerCase() === "champion") {
        return <ChampionPill championKey={props.param} />;
      }
      if (props.identifier.toLowerCase() === "item") {
        return <ItemPill itemId={props.param} />;
      }
      if (props.identifier.toLowerCase() === "trait") {
        return <TraitPill traitKey={props.param} />;
      }
      return <>{`[[${props.identifier}]]`}</>;
    }
  };
  const plugins = [CustomMark];
  return (
    <ReactMarkdown source={value} renderers={renderers} plugins={plugins} />
  );
};

import React from "react";
import { isKeyHotkey } from "is-hotkey";
import {
  Editor,
  RenderMarkProps,
  RenderBlockProps,
  OnChangeParam
} from "slate-react";
import { Value, Editor as CoreEditor, Block } from "slate";
import cx from "classnames";
import styles from "./RichEditor.module.scss";
import { Icon } from "../../../../components/Icon/Icon";

const DEFAULT_NODE = "paragraph";

const isBoldHotkey = isKeyHotkey("mod+b");
const isItalicHotkey = isKeyHotkey("mod+i");
const isUnderlinedHotkey = isKeyHotkey("mod+u");
const isCodeHotkey = isKeyHotkey("mod+`");

interface RichEditorProps {
  readonly onChange: (value: Value) => void;
  readonly value: Value;
}
class RichEditor extends React.Component<RichEditorProps> {
  private editorRef: React.RefObject<Editor>;

  constructor(props: RichEditorProps) {
    super(props);
    this.editorRef = React.createRef();
  }

  hasMark = (type: string) => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark != null && mark.type === type);
  };

  hasBlock = (type: string) => {
    const { value } = this.props;
    return value.blocks.some(node => node != null && node.type === type);
  };

  onChange = ({ value }: OnChangeParam) => {
    this.props.onChange(value);
  };

  renderBlock = (
    props: RenderBlockProps,
    editor: CoreEditor,
    next: () => any
  ) => {
    const { attributes, children, node } = props;

    switch (node.type) {
      case "block-quote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      default:
        return next();
    }
  };

  renderMark = (
    props: RenderMarkProps,
    editor: CoreEditor,
    next: () => any
  ) => {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case "bold":
        return <strong {...attributes}>{children}</strong>;
      case "code":
        return <code {...attributes}>{children}</code>;
      case "italic":
        return <em {...attributes}>{children}</em>;
      case "underlined":
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  };

  onKeyDown = (event: Event, editor: CoreEditor, next: () => any) => {
    let mark;
    if (isBoldHotkey(event as KeyboardEvent)) {
      mark = "bold";
    } else if (isItalicHotkey(event as KeyboardEvent)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event as KeyboardEvent)) {
      mark = "underlined";
    } else if (isCodeHotkey(event as KeyboardEvent)) {
      mark = "code";
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  onContainerClick = () => {
    this.editorRef.current != null && this.editorRef.current.focus();
  };

  onClickMark = (event: React.MouseEvent, type: string) => {
    event.preventDefault();
    this.editorRef.current && this.editorRef.current.toggleMark(type);
  };

  onClickBlock = (event: React.MouseEvent, type: string) => {
    event.preventDefault();

    const editor = this.editorRef.current;
    if (editor == null) {
      return;
    }
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return (
          block != null &&
          !!document.getClosest(
            block.key,
            parent => (parent as Block).type === type
          )
        );
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };

  renderMarkButton = (type: string, icon: string) => {
    const isActive = this.hasMark(type);

    return (
      <button
        type="button"
        className={cx(styles.formatButton, {
          [styles.formatButtonActive]: isActive
        })}
        onClick={event => this.onClickMark(event, type)}
      >
        <Icon>{icon}</Icon>
      </button>
    );
  };

  renderBlockButton = (type: string, icon: string) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        value: { document, blocks }
      } = this.props;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive =
          this.hasBlock("list-item") &&
          parent != null &&
          (parent as Block).type === type;
      }
    }

    return (
      <button
        type="button"
        className={cx(styles.formatButton, {
          [styles.formatButtonActive]: isActive
        })}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </button>
    );
  };

  render() {
    return (
      <div className={styles.container} onClick={this.onContainerClick}>
        <div className={styles.toolbar}>
          {this.renderMarkButton("bold", "format_bold")}
          {this.renderMarkButton("italic", "format_italic")}
          {this.renderMarkButton("underlined", "format_underlined")}
          {this.renderMarkButton("code", "code")}
          {this.renderBlockButton("heading-one", "looks_one")}
          {this.renderBlockButton("heading-two", "looks_two")}
          {this.renderBlockButton("block-quote", "format_quote")}
          {this.renderBlockButton("numbered-list", "format_list_numbered")}
          {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
        </div>
        <div className={styles.editor}>
          <Editor
            spellCheck
            autoFocus
            placeholder="Guide goes here, make it easy to understand..."
            ref={this.editorRef}
            value={this.props.value}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            renderBlock={this.renderBlock}
            renderMark={this.renderMark}
          />
        </div>
      </div>
    );
  }
}

export { RichEditor };

import React from "react";
import isHotkey from "is-hotkey";
import ReactMarkdown from "react-markdown";
import styles from "./TextEditor.module.scss";
import { Icon, Icons } from "../../../../components/Icon/Icon";
import { Champion } from "../Champion/Champion";
import CustomMark from "./CustomMark";
import { Item } from "../Item/Item";

type Format =
  | "champion"
  | "item"
  | "h1"
  | "h2"
  | "b"
  | "i"
  | "ol"
  | "ul"
  | "code"
  | "quote";

type InsertWhere = "start" | "surround" | "cursor";

interface TextEditorProps {
  readonly onChange: (value: string) => void;
  readonly value: string;
}

export class TextEditor extends React.Component<TextEditorProps> {
  private editorRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: TextEditorProps) {
    super(props);
    this.editorRef = React.createRef<HTMLTextAreaElement>();
  }

  onChange(value: string) {
    this.props.onChange(value);
  }

  handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.onChange(e.currentTarget.value);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isHotkey("mod+alt+1", e.nativeEvent)) {
      this.addFormat("h1");
    }
    if (isHotkey("mod+alt+2", e.nativeEvent)) {
      this.addFormat("h2");
    }
    if (isHotkey("mod+b", e.nativeEvent)) {
      this.addFormat("b");
    }
    if (isHotkey("mod+i", e.nativeEvent)) {
      this.addFormat("i");
    }
    if (isHotkey("mod+alt+`", e.nativeEvent)) {
      this.addFormat("code");
    }
  };

  addFormat(format: Format) {
    switch (format) {
      case "h1":
        this.insertTextAt("start", "# ");
        break;
      case "h2":
        this.insertTextAt("start", "## ");
        break;
      case "b":
        this.insertTextAt("surround", "**");
        break;
      case "i":
        this.insertTextAt("surround", "*");
        break;
      case "code":
        this.insertTextAt("surround", "`");
        break;
      case "ul":
        this.insertTextAt("start", "* ");
        break;
      case "ol":
        this.insertTextAt("start", "1. ");
        break;
      case "quote":
        this.insertTextAt("start", "> ");
        break;
      case "champion":
        this.insertTextAt("cursor", "[champion=123]");
        break;
      case "item":
        this.insertTextAt("cursor", "[item=123]");
        break;
    }
  }

  insertTextAt(where: InsertWhere, text: string) {
    if (this.editorRef.current == null) {
      return;
    }
    const editor = this.editorRef.current;
    const { selectionStart, selectionEnd } = editor;
    let newValue = editor.value;

    switch (where) {
      case "start":
        newValue = text + newValue;
        break;
      case "cursor":
        newValue =
          newValue.substr(0, selectionStart) +
          text +
          newValue.substr(selectionEnd, newValue.length);
        break;
      case "surround":
        newValue =
          newValue.substring(0, selectionStart) +
          text +
          newValue.substring(selectionStart, selectionEnd) +
          text +
          newValue.substring(selectionEnd, newValue.length);
        break;
    }
    this.onChange(newValue);
    editor.focus();
  }

  renderFormatButton(format: Format, icon: Icons, label: string) {
    return (
      <button
        type="button"
        className={styles.formatButton}
        onClick={() => this.addFormat(format)}
      >
        <Icon type={icon}>{label}</Icon>
      </button>
    );
  }

  render() {
    const { value } = this.props;
    const renderers = {
      customMark: (props: any) => {
        console.log(props);
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
      <div className={styles.container}>
        <div className={styles.toolbar}>
          {this.renderFormatButton("h1", "h1", "Add heading level 1")}
          {this.renderFormatButton("h2", "h2", "Add heading level 2")}
          {this.renderFormatButton("b", "bold", "Add bold")}
          {this.renderFormatButton("i", "italic", "Add italic")}
          {this.renderFormatButton("ol", "list-numbered", "Add ordered list")}
          {this.renderFormatButton("ul", "list", "Add unordered list")}
          {this.renderFormatButton("code", "code", "Add code")}
          {this.renderFormatButton("quote", "quotes-left", "Add quote")}
          {this.renderFormatButton("champion", "frustrated", "Add champion")}
          {this.renderFormatButton("item", "shield", "Add item")}
        </div>
        <div className={styles.sideBySide}>
          <textarea
            ref={this.editorRef}
            onKeyDown={this.handleKeyDown}
            value={value}
            className={styles.editor}
            onChange={this.handleOnChange}
          />
          <div className={`${styles.preview} Markdown`}>
            <ReactMarkdown
              source={value}
              renderers={renderers}
              plugins={plugins}
            />
          </div>
        </div>
      </div>
    );
  }
}

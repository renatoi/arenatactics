import isHotkey from "is-hotkey";
import React from "react";
import { Icon, Icons } from "../../components/Icon/Icon";
import { Popover } from "../../components/Popover/Popover";
import { ChampionsPopover } from "../ChampionsPopover/ChampionsPopover";
import { ItemsPopover } from "../ItemsPopover/ItemsPopover";
import { MarkdownViewer } from "../MarkdownViewer/MarkdownViewer";
import styles from "./TextEditor.module.scss";

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

  addFormat(format: Format, param?: string) {
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
        this.insertTextAt("cursor", `[[champion=${param}]]`);
        break;
      case "item":
        this.insertTextAt("cursor", `[[item=${param}]]`);
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
        const searchText = newValue.substr(0, selectionStart);
        let strLength = searchText.length;
        let blockStartIndex = 0;
        while (strLength--) {
          if (
            searchText.charAt(strLength) === "\n" &&
            searchText.charAt(strLength - 1) === "\n"
          ) {
            blockStartIndex = strLength + 1;
            break;
          }
        }
        newValue =
          newValue.substring(0, blockStartIndex) +
          text +
          newValue.substring(blockStartIndex, newValue.length);
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

  renderPopoverButton(format: Format, icon: Icons, label: string) {
    const content =
      format === "champion"
        ? () => (
            <ChampionsPopover
              onClick={championKey => this.addFormat(format, championKey)}
            />
          )
        : () => (
            <ItemsPopover
              onClick={itemKey => this.addFormat(format, itemKey)}
            />
          );
    return (
      <Popover placement="bottom-start" content={content}>
        <button type="button" className={styles.formatButton}>
          <Icon type={icon}>{label}</Icon>
        </button>
      </Popover>
    );
  }

  render() {
    const { value } = this.props;
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
          {this.renderPopoverButton("champion", "frustrated", "Add champion")}
          {this.renderPopoverButton("item", "shield", "Add item")}
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
            <MarkdownViewer value={value} />
          </div>
        </div>
      </div>
    );
  }
}

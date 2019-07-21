import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";
import styles from "./MasterDetail.module.css";
import cx from "classnames";

export interface MasterSearchProps {
  readonly onSearchChange: ChangeEventHandler<HTMLInputElement>;
  readonly onClearSearch: MouseEventHandler<HTMLButtonElement>;
  readonly value?: string;
}
export const MasterSearchBox: React.FC<MasterSearchProps> = ({
  onSearchChange,
  onClearSearch,
  value
}) => {
  const shouldShowClearButton = value != null && value !== "";
  const [isFocused, setFocused] = useState(false);
  const handleSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
  };
  const handleSearchBlur = () => {
    setFocused(false);
  };
  return (
    <div
      className={cx(styles.searchBoxWrapper, {
        [styles.searchBoxWrapperFocus]: isFocused
      })}
    >
      <input
        className={styles.searchBox}
        type="text"
        placeholder="Filter"
        value={value}
        onChange={onSearchChange}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />
      {shouldShowClearButton && (
        <button
          type="button"
          className={styles.searchBoxClear}
          onClick={onClearSearch}
        >
          <i className="icon-cancel-circle" />
          <span className="VisuallyHidden">Clear search</span>
        </button>
      )}
    </div>
  );
};

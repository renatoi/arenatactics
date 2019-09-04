import cx from "classnames";
import React, { ChangeEventHandler, MouseEventHandler, useState } from "react";
import styles from "./MasterDetail.module.scss";

export interface MasterSearchProps {
  readonly onSearchChange: ChangeEventHandler<HTMLInputElement>;
  readonly onClearSearch: MouseEventHandler<HTMLButtonElement>;
  readonly value?: string;
  readonly label?: string;
  readonly placeholder?: string;
}
export const MasterSearchBox: React.FC<MasterSearchProps> = ({
  onSearchChange,
  onClearSearch,
  value,
  label,
  placeholder
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
        aria-label={label}
        className={styles.searchBox}
        type="text"
        placeholder={placeholder}
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

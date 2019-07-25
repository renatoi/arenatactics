import React, { useState, useRef } from "react";
import uuidv4 from "uuid/v4";
import styles from "./MasterDetail.module.scss";
import ReactDOM from "react-dom";
import PopperJS from "popper.js";
import cx from "classnames";

const portalRoot = document.body;

export interface MasterFilterBoxProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const MasterFilterBox: React.FC<MasterFilterBoxProps> = () => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const dropRightRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropRightId = useRef(uuidv4());

  React.useEffect(() => {
    if (isOpen && anchorRef.current != null && dropRightRef.current != null) {
      new PopperJS(anchorRef.current, dropRightRef.current, {
        placement: "right-start",
        modifiers: {
          preventOverflow: {
            boundariesElement: "window"
          }
        }
      });
    }
  }, [isOpen]);

  const handleDropRightToggle = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  return (
    <>
      <button
        ref={anchorRef}
        onClick={handleDropRightToggle}
        type="button"
        className={styles.filterBoxButton}
        aria-expanded={isOpen}
        aria-controls={isOpen ? dropRightId.current : undefined}
      >
        Filter
      </button>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            id={dropRightId.current}
            ref={dropRightRef}
            className={styles.dropRight}
          >
            <ul className={styles.dropRightList}>
              <li className={styles.dropRightListItem}>Close</li>
              <li className={styles.dropRightListItem}>Reset</li>
              <li className={styles.dropRightListItem}>
                <span className={styles.dropRightListItemTitle}>Trait</span>
                <ul
                  className={cx(
                    styles.dropRightList,
                    styles.dropRightListNested
                  )}
                >
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Assassin</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Blademaster</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Brawler</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Demon</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Dragon</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Elementalist</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Exile</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>Glacial</label>
                  </li>
                </ul>
              </li>
              <li className={styles.dropRightListItem}>
                <span className={styles.dropRightListItemTitle}>Cost</span>
                <ul
                  className={cx(
                    styles.dropRightList,
                    styles.dropRightListNested
                  )}
                >
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>1</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>2</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>3</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>4</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="checkbox" />
                    <label>5</label>
                  </li>
                </ul>
              </li>
              <li className={styles.dropRightListItem}>
                <span className={styles.dropRightListItemTitle}>Sort By</span>
                <ul
                  className={cx(
                    styles.dropRightList,
                    styles.dropRightListNested
                  )}
                >
                  <li className={styles.dropRightListItem}>
                    <input type="radio" />
                    <label>Name</label>
                  </li>
                  <li className={styles.dropRightListItem}>
                    <input type="radio" />
                    <label>Cost</label>
                  </li>
                </ul>
              </li>
            </ul>
          </div>,
          portalRoot
        )}
    </>
  );
};

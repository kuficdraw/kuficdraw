import React, { useState, useEffect, ReactElement } from "react";
import styles from "./Tabs.module.css";

const Tabs = ({
  children,
  query,
  fillSpace,
}: {
  children: any;
  query: any;
  fillSpace?: boolean;
}) => {
  let tabs = children.filter((tab: any) => {
    if (tab) {
      return tab;
    }
  });
  const [activeTab, setActiveTab] = useState(tabs[0].props["data-enLabel"]);

  const handleClick = (e: any, newActiveTab: string) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className={styles.tabSystem}>
      {/* Tab Header */}
      <ul className={styles.tabs + " " + (fillSpace ? styles.center : "")}>
        {tabs.map(function(tab: ReactElement) {
          const label = tab.props["data-label"];
          const enLabel = tab.props["data-enLabel"];
          tab = (
            <div
              onClick={(e) => handleClick(e, enLabel)}
              className={
                (enLabel == activeTab ? styles.current : "") +
                (label === "" ? " " + styles.hidden : "")
              }
              key={enLabel}
            >
              <li>{label}</li>
            </div>
          );
          return tab;
        })}
      </ul>
      {/* Tab Body */}
      {tabs.map((body: ReactElement) => {
        const label = body.props["data-label"];
        const enLabel = body.props["data-enLabel"];
        const isTextContent = body.props["data-isTextContent"];

        body = (
          <div
            key={enLabel}
            className={
              styles.content +
              (enLabel == activeTab ? " " + styles.active : "") +
              (isTextContent == true ? " " + styles.text : "")
            }
          >
            {body.props.children}
          </div>
        );
        return body;
      })}
    </div>
  );
};

export { Tabs };

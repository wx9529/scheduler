import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayClass = classNames(
    "day-list__item",
    {
      "day-list__item--selected": props.selected,
    },
    { "day-list__item--full": props.spots === 0 }
  );
  function formatSpots() {
    let content = "";
    if (props.spots === 0) {
      content += "no spots remaining";
    } else if (props.spots === 1) {
      content += "1 spot remaining";
    } else {
      content += props.spots + " spots remaining";
    }
    return <h3 className="text--light">{content}</h3>;
  }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      {formatSpots()}
    </li>
  );
}

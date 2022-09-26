import React from "react";
import "./BoardProperties.css";

function BoardProperties() {
  return (
    <div className="properitesSection">
      <form>
        <div>
          <label htmlFor="boardBackgroundColor">لون الخلفية</label>
          <input id="boardBackgroundColor" type="color" value="#ff0000"></input>
        </div>
        <div>
          <label htmlFor="brushColor">لون الفرشاة</label>
          <input id="brushColor" type="color" value="#ff0000"></input>
        </div>
        <div>
          <label htmlFor="gridColor">لون الشبكة</label>
          <input id="gridColor" type="color" value="#ff0000"></input>
        </div>
        <div>
          <label htmlFor="mass">الكتلة</label>
          <input id="mass" type="number" value="40"></input>
        </div>
        <div>
          <label htmlFor="void">الفراغ</label>
          <input id="void" type="number" value="20"></input>
        </div>
      </form>
    </div>
  );
}

export default BoardProperties;

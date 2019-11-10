import React from "react";

export default function GridComponent(props) {
  const { image, url } = props;
  var u = new URL(image, url);
  const description = u.pathname;
  return (
    <div className="col-md-4 col-sm-12 p-5">
      <a href={image}>
        <img src={image} alt="" className="mb-3" width="75%" height="75%"/>
      </a>
      <p>{description}</p>
    </div>
  );
}

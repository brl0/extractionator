import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import queryString from 'query-string';

//TODO Web Template Studio: Add a new link in the NavBar for your page here.
// A skip link is included as an accessibility best practice. For more information visit https://www.w3.org/WAI/WCAG21/Techniques/general/G1.

function get_link(link) {
  const params = window.location.search;
  var n = params.indexOf('/');
  var result = link + '/' + params.slice(n+1);
  return result;
}

export default function NavBar() {
  const params = window.location.search;
  const url = queryString.parse(params).url;
  return (
    <React.Fragment>
      <div className={styles.skipLink}>
        <a href="#mainContent">Skip to Main Content</a>
      </div>
      <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between">
        <Link className="navbar-brand" to="/">
          extractionator
        </Link>
        <form>
          <label>
            URL 
            <input type="text" name="url" defaultValue={url} />
          </label>
          <input type="submit" value="Go" />
        </form>
        <div className="navbar-nav">
          <Link className="nav-item nav-link active" to={get_link("/JsonViewer")}>
            Json
          </Link>
          <Link className="nav-item nav-link active" to={get_link("/TableViewer")}>
            Table
          </Link>
          <Link className="nav-item nav-link active" to={get_link("/TableView2")}>
            Table2
          </Link>
          <Link className="nav-item nav-link active" to="/DetailViewer">
            DetailViewer
          </Link>
          <Link className="nav-item nav-link active" to="/DetailTable">
            DetailTable
          </Link>
          <Link className="nav-item nav-link active" to="/Grid">
            Grid
          </Link>
          <Link className="nav-item nav-link active" to="/Master_Detail">
            Master_Detail
          </Link>
          <Link className="nav-item nav-link active" to="/List">
            List
          </Link>
          <Link className="nav-item nav-link active" to="/Blank">
            Blank
          </Link>
          </div>
      </nav>
    </React.Fragment>
  );
}

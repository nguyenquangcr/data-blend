import React from 'react';

const PageNotFound = () => {
  return (
    <div className="root">
      <div id="wrapper">
        <div class="container">
          <div class="brick"></div>

          <div class="number">
            <div class="four"></div>
            <div class="zero">
              <div class="nail"></div>
            </div>
            <div class="four"></div>
          </div>

          <div class="info">
            <h2>Something is wrong</h2>
            <p>
              The page you are looking for was moved, removed, renamed or might
              never existed.
            </p>
            <a href={process.env.REACT_APP_URL} class="btn">
              Go Home
            </a>
          </div>
        </div>
      </div>
      <footer id="footer">
        <div class="container">
          <div class="worker"></div>
          <div class="tools"></div>
        </div>
      </footer>
    </div>
  );
};

export default PageNotFound;

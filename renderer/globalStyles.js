import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    color: var(--color-text-primary);

    font-kerning: none;
    text-rendering: optimizeSpeed;
    letter-spacing: normal;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";

    min-width: 320px;
    min-height: 100vh;

    &.overflow-y-hidden {
      overflow-y: hidden;
    }
  }

  .font-inter {
    font-family: Inter;
  }

  div.nb-sidebar-container {
    position: absolute;
    height: 100vh;
    z-index: 100;
    border-right: solid 1px #e2e2e2;
    background-color: rgb(243, 243, 243);
    min-width: 200px;

    @media (min-width: 768px) {
      position: relative;
      border-right: none;
    }
  }

  main.kgraph-app {
    width: 100%;

    /* this is for page options dropdown overflow issue */
    &.page-editor, &.page-daily {
      max-width: inherit;
    }

    /* height: 100vh; */
    margin: 0 auto;

    overflow-y: scroll;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar { /* WebKit */
      width: 0;
      height: 0;
    }
  }

  div.container.root {
    width: 100%;
    min-height: 100vh;
    min-width: 320px;
    max-width: 100%;
    padding-left: 0;
    padding-right: 0;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
     opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes fade-and-slide-in-from-top {
    from {
      opacity: 0;
      -webkit-transform: translateY(-30px);
              transform: translateY(-30px);
    }
    to {
      opacity: 1;
      -webkit-transform: none;
              transform: none;
    }
  }

  @keyframes fade-and-slide-out-from-top {
    from {
      opacity: 1;
      -webkit-transform: none;
              transform: none;
    }
    to {
      opacity: 2;
      -webkit-transform: translateY(-30px);
              transform: translateY(-30px);
    }
  }
`;
 
export default GlobalStyle;
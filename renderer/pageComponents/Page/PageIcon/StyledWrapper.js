import styled from 'styled-components';

const Wrapper = styled.div`
  .react-tabs {
    margin-top: 0.5rem;
  }

  .react-tabs__tab-list {
    background-color: white;
    border-bottom: none;
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 0.875rem;

    .react-tabs__tab {
      padding: 6px 0px;
      border: none;
      user-select: none;
      border-bottom: solid 2px transparent;
      margin-right: 1.25rem;
      color:  ${props => props.theme.navbar.inactive2};

      &:focus {
        outline: none !important;
        box-shadow: none !important;
        border-bottom: solid 2px ${props => props.theme.navbar.active} !important;
        border-color: ${props => props.theme.navbar.active} !important;
      }

      &:after {
        display: none !important;
      }
    }
  }

  .react-tabs__tab--selected {
    color: ${props => props.theme.navbar.active} !important;
    border-bottom: solid 2px ${props => props.theme.navbar.active} !important;;
    font-weight: 600;
    background: inherit;
    border: none;
  }

  .react-tabs__tab-panel {
    margin-top: 1rem;
  }
`;

export default Wrapper;

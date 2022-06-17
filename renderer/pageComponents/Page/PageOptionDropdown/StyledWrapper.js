import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 1rem;
  white-space: nowrap;
  z-index: 1000;
  background-color: white;

  .popover {
    border-radius: 3px;
    border-radius: var(--border-radius);
    box-shadow: rgb(50 50 93 / 25%) 0px 6px 12px -2px, rgb(0 0 0 / 30%) 0px 3px 7px -3px;

    .popover-content {
      width: 125px;
      padding-top: 0.3rem;
      padding-bottom: 0.3rem;
    }

    .dropdown-item {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      padding: .3rem .5rem;
      cursor: pointer;

      &:hover {
        background-color: #eee;
      }
    }
  }
`;

export default Wrapper;

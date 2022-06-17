import styled from 'styled-components';

const StyledWrapper = styled.div`
  .popover {
    position: absolute;
    min-width: 200px;
    border-radius: 3px;
    box-shadow: 0 2px 10px rgb(107 107 107 / 20%);
    border: solid 1px silver;
    padding: 5px 5px;
    background: white;
    z-index: 1000;

    .item {
      padding: 5px 4px;
      background-color: white;

      &.selected {
        background-color: rgb(234, 234, 234);
      }
    }
  }
`;

export default StyledWrapper;

import styled from 'styled-components';

const Wrapper = styled.div`
  .notebase-page-title {
    margin-left: -2rem;
    margin-right: -2rem;
    padding-left: 2rem;
    padding-right: 2rem;

    cursor: pointer;

    &:hover {
      .menu-icon {
        display: flex !important;
      }  
    }

    .menu-icon {
      color: ${props => props.theme.colors.gray2};
      position: absolute;
      display: none;
      justify-content: center;
      cursor: pointer;
      width: 30px;
      left: 0;
    }

    input.title {
      background-color: inherit;
      font-size: 2.2rem;
      font-weight: 600;
      padding-left: 0;
      outline: none;
      box-shadow: none;
      border: none;
      line-height: 1.2;

      &:focus, &:hover {
        outline: none;
        box-shadow: none;
      }
    }
  }

  div.notebase-description {
    margin-top: -1rem;
    color: rgb(101 101 101);
    font-size: 0.9375rem;
    padding-left: 2px;
  }
`;

export default Wrapper;


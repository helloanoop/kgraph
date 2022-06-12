import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  letter-spacing: initial;
  position: fixed;
  min-height: 100vh;
  width: 200px;
  background-color: rgb(243, 243, 243);
  user-select: none;

  .notebase-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 0.75rem;
    width: 120px;
  }

  nav {
    a {
      display: flex;
      cursor: pointer;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      color: rgb(92 92 92);

      span {
        font-size: 0.9375rem;
        margin-left: 0.75rem;
      }

      &:hover span{
        text-decoration: underline;
      }
    }
  }
`;

export default StyledWrapper;

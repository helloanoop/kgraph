import styled from 'styled-components';

const Wrapper = styled.div`
  background: #f2f2f2;
  padding: 10px 10px;
  border-radius: 3px;
  margin-top: 8px;

  .link-title {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .linked-block {
    font-size: 0.9375rem;

    &:last-child {
      margin-bottom: 4px;
    }
  }
`;

export default Wrapper;

import styled from 'styled-components';

const Wrapper = styled.div`
  .emoji-list {
    display: grid;
    grid-template-columns: repeat(15, 1fr);
    gap: 6px;

    .emoji {
      display: inline-block;
      text-align: center;
    }
  }
`;

export default Wrapper;

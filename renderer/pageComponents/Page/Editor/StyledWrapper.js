import styled from 'styled-components';

const Wrapper = styled.div`
  > div.notebase-block-container {
    margin-left: 0;
    border-left: none;
  }

  &.notebase-editor {
    &.is-outliner {
      span.notebase-block-bullet {
        display: none !important;
      }

      div.notebase-block-content {
        padding: 6px 4px 6px 0px;
      }

      div.notebase-block-container {
        border-left: none !important;
      }

      textarea.notebase-block-content-editing {
        padding: 6px 4px 6px 0px;
      }
    }
  }
`;

export default Wrapper;


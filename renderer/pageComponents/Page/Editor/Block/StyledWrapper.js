import styled from 'styled-components';

const Wrapper = styled.div`
  margin-left: 0.375rem;
  border-left: solid 1px #d8d8d8;

  textarea.notebase-block-content-editing {
    border: none;
    padding: 3px 4px;
    background: transparent;
    resize: none;
    box-sizing: border-box;
    overflow: hidden;
    overflow-wrap: break-word;
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  .notebase-block-content-container {
    padding-left: 1rem;
    padding-right: 1rem;
    margin-left: -1rem;
    margin-right: -1rem;

    .folder-arrow {
      display: none;

      svg {
        position: absolute;
        fill: currentColor;
        display: inline-block;
        user-select: none;
        color: ${props => props.theme.colors.gray2};
        font-size: 15px;
        top: 8px;
        left: 0px;
        width: 1rem;
      }
    }

    &:hover {
      span.folder-arrow.can-collapse {
        display: block !important;
      }
    }
  }

  div.notebase-block-content {
    min-height: 30px;
    padding: 3px 4px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    width: 100%;

    input[type=checkbox] {
      position: relative;
      top: 2px;
    }
  }

  span.notebase-block-bullet {
    font-size: 5px;
    min-height: 20px;
    padding-right: 5px;
    display: flex;
    align-items: center;

    .bullet-outer {
      padding: 0.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;

      &.collapsed {
        background: rgb(210 210 210);

        .bullet-inner {
          background: ${props => props.theme.colors.black3};
        }
      }
    }

    .bullet-inner {
      width: 0.3125rem;
      height: 0.3125rem;
      background: ${props => props.theme.block.bullet};
      display: inline-block;
      border-radius: 50%;
    }

    /* color: #c7c7c7; */
    /* color: rgb(160 160 160); */
    /* color: rgb(179 179 179); */
    color: ${props => props.theme.block.bullet};
  }
`;

export default Wrapper;

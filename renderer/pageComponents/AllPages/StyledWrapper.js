import styled from 'styled-components';

const Wrapper = styled.div`
  .all-pages-title {
    font-size: 24px;
    color: ${(props) => props.theme.allNotes.title};
  }

  .notebase-page-title {
    font-size: 2rem;
    font-weight: 600;
  }

  .react-loading-skeleton {
    margin-bottom: 0.5rem;
  }

  table.notebase-all-pages {
    th {
      font-weight: 600;
      font-size: 1rem;
      border-bottom: solid 1px #e8e8e8;
    }

    tbody {
      td {
        border-bottom: solid 1px #e8e8e8;

        &.word-count, &.created-at, &.updated-at {
          font-size: 0.9375rem;
          color: ${(props) => props.theme.colors.gray3};
        }
      }

      tr {
        &:last-child {
          td {
            border-bottom: none;
          }
        }
      }
    }

    .page-title {
      color: ${(props) => props.theme.colors.color};
    }
  }

  button.delete {
    border-radius: 3px;
    padding: 3px 8px;
    color: #212529;
    background-color: #e2e6ea;
    border-color: #dae0e5;

    &:hover, &:focus {
      border-color: #696969;
      outline: none;
      box-shadow: none;
    }

    .sync {
      color: #676767;
      font-size: 14px;
      margin-right: 4px;
    }
  }
`;

export default Wrapper;

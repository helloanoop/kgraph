import styled from 'styled-components';

const StyledWrapper = styled.div`
  .downshift-dropdown {
    width: 100%;

    .dropdown-item {
      font-size: 1rem;
      padding: 0.5rem 1.4rem;
      color: rgba(47, 48, 55, 0.6);

      &.selected {
        background-color: rgb(234, 234, 234);
        color: rgba(47, 48, 55, 0.6);
      }

      .new-page {
        span.new-page-label {
          color: #0d800d;
        }
      }
    }
  }

  .searchbox-container {
    border-bottom: solid 1px #eaeaea;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .search-icon {
    width: 18px;
  }

  .close-icon {
    font-size: 1.3rem;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.5;
    margin-top: -2px;

    &:hover {
      opacity: 0.8;
    }
  }

  input.search-notebase {
    border: white;
    width: 100%;
    margin-left: 10px;
    font-size: 1.125rem;

    &::placeholder {
      color: silver;
    }
  }

  textarea:focus, input:focus{
    outline: none;
  }
`

export default StyledWrapper;

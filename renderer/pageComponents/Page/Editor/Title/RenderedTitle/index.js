import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { slugify } from 'utils/text';
import StyledWrapper from './StyledWrapper';

const RenderedTitle = ({caller, page, title, onEdit}) => {
  const router = useRouter();
  const pageSlug = slugify(title);

  const handleClick = (event) => {
    if(['dailynotes'].includes(caller)) {
      router.push(`/${page.uid}`);
    }

    return onEdit(event);
  };

  if(pageSlug === 'index') {
    return (
      <StyledWrapper onClick={handleClick}>
        <div className="page-title">Notebase Name TBD</div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper onClick={handleClick}>
      <div className={`page-title caller-${caller}`}>{title}</div>
    </StyledWrapper>
  );
};

RenderedTitle.propTypes = {
  page: PropTypes.object.isRequired,
  caller: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default RenderedTitle;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LinkedReference from './LinkedReference';
import StyledWrapper from './StyledWrapper';
import datascript from 'datascript';
import { useStore } from 'providers/Store';

const LinkedReferences = ({noteUid}) => {
  const [results, setResults] = useState([]);
  const [state] = useStore();
  const {
    pageMap,
    datascriptConnection
  } = state;

  const page = pageMap.get(noteUid);

  useEffect(() => {
    if(page.title && page.title.length) {
      const dsQuery = `
        [:find ?pid ?puid ?pTitle
          :where [?pid ":page/refs" ?refPageId]
                [?pid ":page/title" ?pTitle]
                [?pid ":page/uid" ?puid]
                [?refPageId ":page/title" "${page.title}"]]
      `;
      const results = datascript.q(dsQuery, datascript.db(datascriptConnection));
      setResults(results);
    }
  }, [page.title]);


  return (
    <StyledWrapper className="mt-6 linked-references">
      <h3 className="font-semibold">{results.length} Linked References</h3>
      {(results && results.length) ? results.map((r) => {
        return (
          <div key={r[0]}>
            <LinkedReference pageUid={r[1]} title={r[2]} currentPageTitle={page.title}/>
          </div>
        );
      }) : null}
    </StyledWrapper>
  );
};

LinkedReferences.propTypes = {
  noteUid: PropTypes.string.isRequired
};

export default LinkedReferences;

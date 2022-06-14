import datascript from 'datascript';

if (process.browser && process.env.NEXT_PUBLIC_ENV === 'dev') {
  window.ds = datascript;
}

export const createConnection = () => {
  const kgraphSchema = {
    ':page/title': {
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':page/uid': {
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':page/slug': {
      ':db/cardinality': ':db.cardinality/one',
      ':db/unique': ':db.unique/identity'
    },
    ':page/refs': {
      ':db/cardinality': ':db.cardinality/many',
      ':db/valueType': ':db.type/ref'
    }
  };

  const connection = datascript.create_conn(kgraphSchema);

  return connection;
};

// datascript :db/id generator
let __dsid = 0;
export const dsid = () => {
  return ++__dsid;
};
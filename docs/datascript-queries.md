### Datascript Queries

```bash
# Find all eav's
ds.q(`
  [:find ?e ?a ?v
    :where [?e ?a ?v]]
  `, ds.db(dc));

# Find if slug exists
ds.q(`
  [:find ?e .
    :where [?e ":page/slug" "hello-world"]]
  `, ds.db(dc));

# Find all refs
ds.q( `
  [:find ?pid ?refPageId
    :where [?pid ":page/refs" ?refPageId]]
  `, ds.db(dc));

# Find all refs
ds.q(`
  [:find ?pTitle ?rTitle
    :where [?pid ":page/refs" ?refPageId]
           [?pid ":page/title" ?pTitle]
           [?refPageId ":page/title" ?rTitle]]
  `, ds.db(dc));

ds.q(`
  [:find ?puid ?pTitle ?ruid ?rTitle
    :where [?pid ":page/refs" ?refPageId]
           [?pid ":page/title" ?pTitle]
           [?pid ":page/uid" ?puid]
           [?refPageId ":page/uid" ?ruid]
           [?refPageId ":page/title" ?rTitle]]
  `, ds.db(dc));

# Find all linked refs 
ds.q(`
  [:find ?pid ?puid ?pTitle
    :where [?pid ":page/refs" ?refPageId]
           [?pid ":page/title" ?pTitle]
           [?pid ":page/uid" ?puid]
           [?refPageId ":page/title" "bruno"]]
  `, ds.db(dc));

# Update by id
ds.transact(dc, [{
  ':db/id': 1,
  ':page/title': 'new title'
}]);
```
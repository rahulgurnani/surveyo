import React, {useState} from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

const URL = 'https://play.dgraph.io/graphql';

const queries = [
  {
    name: 'Filmed in San Francisco',
    queryString: `query {
	queryLocation(
		filter: { name: {eq: "San Francisco"} }
	) {
		name
		featured_in_films (
			order: { desc: initial_release_date },
			first: 3
		) {
			name
			initial_release_date
			featured_locations {
				name
			}
		}
	}
}`,
  },
  {
    name: 'Director Films',
    queryString: `query {
	queryDirector(
		filter: { name: {eq: "Tom Hanks"} }
	) {
		name
		films(
			filter: { initial_release_date: {ge: "1970-01-01"} }
		) {
			initial_release_date
			name
		}
	}
}`,
  },
  {
    name: 'Filter by Full-Text',
    queryString: `query {
	queryDirector(
		filter: { name: { eq: "Steven Spielberg" } }
	) {
		name
		films(
			filter: {
				name: { alloftext: "jones indiana" }
				or: { name: { alloftext: "jurassic park" } }
			}
		) {
			name
		}
	}
}`,
  },
  {
    name: 'Sort by Date',
    queryString: `query {
	queryDirector(
		filter: { name: { allofterms: "steven spielberg" } }
	) {
		name
		films(
			order: { asc: initial_release_date }
		) {
			name
			initial_release_date
		}
	}
}`,
  },
];

function GraphiqlCard({question, updateQuestion, deleteQuestion}: any) {
  const [query, setQuery] = useState(queries[0].queryString);

  const graphQLFetcher = (graphQLParams: any) => {
    return fetch(URL, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  };

  return (
    <>
      <div className="query-panel">
        {queries.map(q => (
          <div
            key={q.name}
            className={
              'query-item ' + (q.queryString === query ? 'active' : '')
            }
            onClick={() => setQuery(q.queryString)}
          >
            {q.name}
          </div>
        ))}
      </div>

      <div className="graphiql-panel">
        <GraphiQL
          fetcher={graphQLFetcher}
          query={query}
          onEditQuery={(q: any) => setQuery(q)}
        />
      </div>
    </>
  );
}

export default GraphiqlCard;

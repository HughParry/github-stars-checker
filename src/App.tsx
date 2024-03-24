import React, { useState } from "react";
import { StarCard } from "./StarCard";

// TODO:
// 1. Replace the placeholder text with the actual access token you generated
// 2. Update the query to get risk factors per user, e.g. number of followers, number of repositories, etc.
// 3. Update the StarCard component to display the risk factors
// 4. add pagination
// 5. make it look nice
// 6. some sort of monitoring, terms, etc

const App: React.FC = () => {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [stargazers, setStargazers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStargazers = async () => {
    setLoading(true);
    let allStargazers: any[] = [];
    let hasNextPage = true;
    let endCursor = null;

    try {
      while (hasNextPage) {
        const query = `
          query($owner: String!, $repo: String!, $endCursor: String) {
            repository(owner: $owner, name: $repo) {
              stargazers(first: 100, after: $endCursor) {
                edges {
                  node {
                    login
                    avatarUrl
                    url
                  }
                  starredAt
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        `;

        const variables = {
          owner: owner,
          repo: repo,
          endCursor: endCursor,
        };

        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer GET AUTH FROM OAUTH AND USE HERE`, // Replace with your actual access token
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        const stargazers = result.data.repository.stargazers.edges.map(
          (edge: any) => ({
            user: {
              login: edge.node.login,
              avatar_url: edge.node.avatarUrl,
              html_url: edge.node.url,
            },
            starred_at: edge.starredAt,
          })
        );

        allStargazers = allStargazers.concat(stargazers);
        hasNextPage = result.data.repository.stargazers.pageInfo.hasNextPage;
        endCursor = result.data.repository.stargazers.pageInfo.endCursor;
      }

      setStargazers(allStargazers);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch stargazers data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>GitHub Stargazers</h1>
      <input
        type="text"
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
        placeholder="Repository owner"
      />
      <input
        type="text"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="Repository name"
      />
      <button onClick={fetchStargazers} disabled={loading}>
        {loading ? "Loading..." : "Get Stargazers"}
      </button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {stargazers.map((stargazer, index) => (
          <StarCard
            key={index}
            login={stargazer.user.login}
            avatarUrl={stargazer.user.avatar_url}
            htmlUrl={stargazer.user.html_url}
            starredAt={stargazer.starred_at}
          />
        ))}
      </div>
    </div>
  );
};

export default App;

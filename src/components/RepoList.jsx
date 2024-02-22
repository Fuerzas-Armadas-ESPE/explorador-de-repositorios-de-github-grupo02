import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const RepoList = ({ username }) => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );
        const sortedRepos = response.data.sort((a, b) => b.size - a.size);
        const topRepos = sortedRepos.slice(0, 5);
        setRepos(topRepos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div>
      <h2>Top 5 repositorios con más participación de {username}</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            {repo.name} - Tamaño: {repo.size}
          </li>
        ))}
      </ul>
    </div>
  );
};

RepoList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RepoList;

import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Card } from "@mui/material";

const RepoList = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [filter, setFilter] = useState('none'); // Cambiar el estado inicial a 'none'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );
        let sortedRepos;
        switch(filter) { // Filtrar repositorios basado en el estado del filtro
          case 'stars':
            sortedRepos = response.data.sort((a, b) => b.stargazers_count - a.stargazers_count);
            break;
          case 'created':
            sortedRepos = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'language':
            sortedRepos = response.data.sort((a, b) => b.language - a.language);
            break;
          default:
            sortedRepos = response.data; // Si el filtro es 'none' o cualquier otro valor, no se aplica ningún filtro
        }
        const topRepos = sortedRepos.slice(0, 5);
        setRepos(topRepos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchData();
  }, [username, filter]); // Agregar el filtro como dependencia

  const handleFilterChange = (event) => { // Nueva función para manejar los cambios en el filtro
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Top 5 repositorios con más participación de {username}</h2>
      <select onChange={handleFilterChange}> // Selector para cambiar el filtro
        <option value="none">Ningún filtro</option> // Agregar la opción de 'Ningún filtro'
        <option value="stars">Estrellas</option>
        <option value="created">Fecha de creación</option>
        <option value="language">Idioma predominante</option>
      </select>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            {repo.name} - Tamaño: {repo.size} - Estrellas: {repo.stargazers_count} - Lenguaje: {repo.language} - Fecha de creación: {repo.created_at}
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

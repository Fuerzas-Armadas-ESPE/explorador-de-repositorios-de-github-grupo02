import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Slide, Select, MenuItem, Card, CardContent, Typography  } from "@mui/material";

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
      <Select value={filter} onChange={handleFilterChange}>
        <MenuItem value="none">Ningún filtro</MenuItem>
        <MenuItem value="stars">Estrellas</MenuItem>
        <MenuItem value="created">Fecha de creación</MenuItem>
        <MenuItem value="language">Idioma predominante</MenuItem>
      </Select>
      <ul>
        {repos.map((repo) => (
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Card key={repo.id} sx={{ marginBottom: "10px" }}>
            <CardContent>
              <Typography variant="h6">{repo.name}</Typography>
              <Typography color="text.secondary">Tamaño: {repo.size}</Typography>
              <Typography color="text.secondary">Estrellas: {repo.stargazers_count}</Typography>
              <Typography color="text.secondary">Lenguaje: {repo.language}</Typography>
              <Typography color="text.secondary">Fecha de creación: {new Date(repo.created_at).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
          </Slide>
        ))}
      </ul>
    </div>
  );
};

RepoList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RepoList;

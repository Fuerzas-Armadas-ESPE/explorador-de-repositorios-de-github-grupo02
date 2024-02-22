import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Slide, Select, MenuItem, Card, CardContent, Typography, Pagination } from "@mui/material";

const RepoList = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [filter, setFilter] = useState('none');
  const [currentPage, setCurrentPage] = useState(1); // Nuevo estado para la página actual
  const reposPerPage = 5; // Cantidad de repositorios por página

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos`
        );
        let sortedRepos;
        switch(filter) {
          case 'stars':
            sortedRepos = response.data.sort((a, b) => b.stargazers_count - a.stargazers_count);
            break;
          case 'created':
            sortedRepos = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'language':
            sortedRepos = response.data.sort((a, b) => a.language.localeCompare(b.language));
            break;
          default:
            sortedRepos = response.data;
        }
        setRepos(sortedRepos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchData();
  }, [username, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Calcular los repositorios que se deben mostrar en la página actual
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = repos.slice(indexOfFirstRepo, indexOfLastRepo);

  // Cambiar la página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <h2>Repositorios de {username}</h2>
      <Select value={filter} onChange={handleFilterChange}>
        <MenuItem value="none">Ningún filtro</MenuItem>
        <MenuItem value="stars">Estrellas</MenuItem>
        <MenuItem value="created">Fecha de creación</MenuItem>
        <MenuItem value="language">Idioma predominante</MenuItem>
      </Select>
      <ul>
        {currentRepos.map((repo) => (
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
      <Pagination count={Math.ceil(repos.length / reposPerPage)} page={currentPage} onChange={handlePageChange} />
    </div>
  );
};

RepoList.propTypes = {
  username: PropTypes.string.isRequired,
};

export default RepoList;

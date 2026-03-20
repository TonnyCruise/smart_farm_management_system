import { useEffect, useState } from "react";
import API from "./api";

function Animals({ token }) {
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState(null);

  const fetchAnimals = () => {
    API.get("/animals", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAnimals(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load animals. Please try again.");
      });
  };

  useEffect(() => {
    fetchAnimals();
  }, [token]);

  return (
    <div>
      <h1>Animals</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {animals.length === 0 ? (
        <p>No animals found. Please add some animals first.</p>
      ) : (
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tag</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Health Status</th>
          </tr>
        </thead>

        <tbody>
          {animals.map(animal => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.animal_tag}</td>
              <td>{animal.species}</td>
              <td>{animal.breed}</td>
              <td>{animal.gender}</td>
              <td>{animal.birth_date}</td>
              <td>{animal.health_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}

export default Animals;
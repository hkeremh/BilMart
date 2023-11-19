import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [backendData, setBackendData] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch("/listings");
        const data = await response.json();
        setBackendData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    console.log("in V")
    fetchData();
  }, []);

  return (
      <div>
        {backendData.length === 0 ? (
            <p>Loading...</p>
        ) : (
            backendData.map((listing, i) => (
                <p key={i}>{listing.name} - {listing.description}</p>
            ))
        )}
      </div>
  );
}

export default App;

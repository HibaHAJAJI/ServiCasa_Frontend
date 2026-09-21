import React from 'react';
import { useParams } from 'react-router-dom';

const ArtisanProfile = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Artisan Profile {id}</h1>
    </div>
  );
};

export default ArtisanProfile;

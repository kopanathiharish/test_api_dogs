"use client";

import { useEffect, useState } from "react";

export default function DogGallery() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDog, setSelectedDog] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  async function fetchDogs() {
    setLoading(true);
    try {
      const url = selectedBreed
        ? `https://api.thedogapi.com/v1/images/search?limit=10&has_breeds=true&breed_ids=${selectedBreed}`
        : "https://api.thedogapi.com/v1/images/search?limit=10&has_breeds=true";

      const response = await fetch(url);
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.error("Error fetching dog images:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBreeds() {
    try {
      const response = await fetch("https://api.thedogapi.com/v1/breeds");
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  }

  useEffect(() => {
    fetchBreeds();
    fetchDogs();
  }, []);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-5` }>
      <h1 className="text-3xl font-bold text-center mb-5">🐶 Dog Gallery</h1>

      {/* Dark Mode Toggle */}
      <div className="text-center mb-5">
        <button className="px-4 py-2 bg-gray-700 text-white rounded-md" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Search Bar & Breed Filter */}
      <div className="text-center mb-5 flex justify-center gap-4">
        <input
          type="text"
          placeholder="Search Breeds..."
          className="p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border rounded-md"
          value={selectedBreed}
          onChange={(e) => {
            setSelectedBreed(e.target.value);
            fetchDogs();
          }}
        >
          <option value="">All Breeds</option>
          {breeds
            .filter((breed) => breed.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((breed) => (
              <option key={breed.id} value={breed.id}>{breed.name}</option>
            ))}
        </select>
      </div>

      {/* Dog Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dogs.map((dog, index) => (
          <div key={index} className="p-3 shadow-lg rounded-lg cursor-pointer" onClick={() => setSelectedDog(dog)}>
            <img
              src={dog.url}
              alt="Dog"
              className="w-full h-64 object-cover rounded-md transition-transform duration-200 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* View Larger Image Modal */}
      {selectedDog && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg text-center">
            <img src={selectedDog.url} alt="Dog" className="w-full h-auto rounded-md" />
            <h2 className="text-2xl font-bold mt-3">🐾 {selectedDog.breeds[0]?.name || "Unknown Breed"}</h2>
            <p><strong>Temperament:</strong> {selectedDog.breeds[0]?.temperament || "Not available"}</p>
            <p><strong>Weight:</strong> {selectedDog.breeds[0]?.weight?.metric} kg</p>
            <p><strong>Life Span:</strong> {selectedDog.breeds[0]?.life_span}</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => setSelectedDog(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

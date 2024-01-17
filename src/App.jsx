import "./App.css";
import { useState } from "react";
import axios from "axios";

// https://api.genius.com/search?q=${encodeURIComponent(artistName)}%20${encodeURIComponent(songTitle)}

function App() {
  const [artistName, SetArtistName] = useState("");
  const [songTitle, SetSongTitle] = useState("");
  const [lyrics, setLyrics] = useState("");

  function handleArtistNameChange(e) {
    SetArtistName(e.target.value);
  }

  const handleSongTitleChange = (e) => {
    SetSongTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace 'YOUR_ACCESS_TOKEN' with the actual access token you obtained from Genius.com
      const accessToken =
        "VTULonDJEA6DxINCzTsREIRYTWq2bcovQllfHwrB5KrRsm9giel_X162nMpwWgAR";
      const response = await axios.get(
        `https://api.genius.com/search?q=${encodeURIComponent(
          artistName
        )}%20${encodeURIComponent(songTitle)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Genius API Response:", response);

      if (response.data.response.hits.length === 0) {
        throw new Error("Song not found");
      }

      // Assuming the first search result contains the desired song
      const songId = response.data.response.hits[0].result.id;
      const lyricsResponse = await axios.get(
        `https://api.genius.com/songs/${songId}/lyrics`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLyrics(lyricsResponse.data.response.lyrics.body);
    } catch (error) {
      console.error("Error fetching lyrics:", error.message);
    }
  };

  return (
    <main>
      <h1 className="mb-7 capitalize lg:text-[50px] text-[35px] font-bold max-w-[800px]">
        Check the meanings behind your favourite songs
      </h1>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 items-center justify-center">
          <label htmlFor="artist-name" className="font-medium">
            Input Artist Name
          </label>

          <input
            type="text"
            name="artist-name"
            value={artistName}
            onChange={handleArtistNameChange}
            placeholder="Ex: Omah Lay"
            className="w-[300px] py-[5px] px-[10px] rounded-md input placeholder-gray-300"
            required
          />
        </div>

        <div className="flex flex-col gap-1 items-center justify-center">
          <label htmlFor="song-title" className="font-medium">
            Input Song Title
          </label>

          <input
            type="text"
            name="song-title"
            value={songTitle}
            onChange={handleSongTitleChange}
            placeholder="Ex: Soso"
            className="w-[300px] py-[5px] px-[10px] rounded-md input placeholder-gray-300"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#df2b17] w-[300px] py-[15px] px-[10px] rounded-md input placeholder-gray-100 m-auto"
        >
          Check Song Meaning
        </button>

        {lyrics && (
          <div className="mt-4">
            <h2 className="text-xl font-bold">Lyrics:</h2>
            <p>{lyrics}</p>
          </div>
        )}
      </form>
    </main>
  );
}

export default App;

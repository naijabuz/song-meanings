import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import OpenAI from "openai";

// https://api.genius.com/search?q=${encodeURIComponent(artistName)}%20${encodeURIComponent(songTitle)}

function App() {
  const [artistName, SetArtistName] = useState("");
  const [songTitle, SetSongTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [songMeaning, setSongMeaning] = useState("");
  const [loading, SetLoading] = useState(false);
  // const [song, setSong] = useState("");

  function handleArtistNameChange(e) {
    SetArtistName(e.target.value);
  }

  const handleSongTitleChange = (e) => {
    SetSongTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const songSearchResponse = await axios.get(
        `http://localhost:3000/api/song-search`,
        {
          params: {
            artistName,
            songTitle,
          },
        }
      );

      const songSearchResponseData = songSearchResponse.data;
      console.log("Song Search Response Data:", songSearchResponseData);

      const songID =
        songSearchResponseData.message.body.track_list[0].track.track_id;
      console.log("Song ID:", songID);

      try {
        const songLyricsResponse = await axios.get(
          `http://localhost:3000/api/get-lyrics`,
          {
            params: {
              songID,
            },
          }
        );

        const songLyricsData = songLyricsResponse.data;
        const songLyrics = songLyricsData.message.body.lyrics.lyrics_body;

        console.log("Requested Song Lyrics:", songLyrics);

        // OPENAI API CODE LOGIC BEGINNING
        const openai = new OpenAI({
          apiKey: "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",
          dangerouslyAllowBrowser: true,
        });

        try {
          SetLoading(true);
          const songMeaningResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a well rounded music analyst, song meanings explanations expert and music intrepreter",
              },
              {
                role: "user",
                content: `Explain the meaning of this song "${songTitle}" by "${artistName}". This is the lyrics: "${songLyrics}"`,
              },
            ],
            temperature: 1,
            max_tokens: 232,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });

          setSongMeaning(songMeaningResponse.choices[0].message.content);

          console.log("The meaning of the song is: ", songMeaning);
          SetLoading(false);
        } catch (error) {
          SetLoading(false);
          if (error.response) {
            console.log(`OpenAI - The Error Data is: ${error.response.data}`);
            console.log(
              `OpenAI - The Error Status is: ${error.response.status}`
            );
            console.log(
              `OpenAI - The Error Headers are: ${error.response.headers}`
            );
            console.log(error.response);
          } else {
            console.log(
              `OpenAI Error Message recieved due to error.response been false: ${error.message}`
            );
          }
        }
      } catch (error) {
        console.log("Error Getting Lyrics:", error.response);
        console.log("Error Getting Lyrics:", error.message);
      }
    } catch (error) {
      if (error.response) {
        console.log("Error Getting Song:", error.response);
        console.log("Error Getting Song:", error.response.status);
      } else {
        console.log("Error Getting Song:", error.message);
      }
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

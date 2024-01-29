require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors"); // Import the cors middleware

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174", // Adjust the allowed origin as needed
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
); // Use cors middleware

app.get("/api/song-search", async (req, res) => {
  try {
    const { artistName, songTitle } = req.query;

    const songSearchResponse = await axios.get(
      `http://api.musixmatch.com/ws/1.1/track.search`,
      {
        params: {
          q_artist: artistName,
          q_track: songTitle,
          page_size: 3,
          page: 1,
          s_track_rating: "desc",
          apikey: process.env.MUSIXMATCH_API_KEY,
        },
      }
    );

    const songSearchResponseData = songSearchResponse.data;
    res.json(songSearchResponseData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/get-lyrics", async (req, res) => {
  try {
    const { songID } = req.query;

    const songLyricsResponse = await axios.get(
      `http://api.musixmatch.com/ws/1.1/track.lyrics.get`,
      {
        params: {
          track_id: songID,
          apikey: process.env.MUSIXMATCH_API_KEY,
        },
      }
    );

    const songLyricsData = songLyricsResponse.data;
    res.json(songLyricsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

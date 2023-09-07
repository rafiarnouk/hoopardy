import React, { useState, useEffect } from "react"
import axios from "axios"
import Hint from "./Hint.js"
import PlayerCollection from "./PlayerCollection.js"
import { useCookies } from "react-cookie"
/* import { UserModel } from "../../backend/src/models/Users.js" */
import "./styles.css"

let playerPool = [
  "stephen curry", "lebron james", "luka doncic", "nikola jokic", "giannis antetokounmpo",
  "joel embiid", "damian lillard", "ja morant", "kevin durant", "devin booker",
  "jayson tatum", "donovan mitchell", "jimmy butler", "kyrie irving", "kawhi leonard",
  "paul george", "zion williamson", "bam adebayo", "james harden", "deandre ayton",
  "bradley beal", "julius randle", "jamal murray", "jalen green", "brandon ingram",
  "pascal siakam", "fred vanvleet", "demar derozan", "kyle lowry", "anthony davis",
  "karl-anthony towns", "rudy gobert", "chris paul", "lamelo ball", "jaylen brown",
  "trae young", "russell westbrook", "draymond green", "aaron gordon", "lauri markkanen"
]

let correctCounter = 0

export function Home() {
  const [player, setPlayer] = useState("")
  const [status, setStatus] = useState("unanswered")
  const [playerName, setPlayerName] = useState(playerPool[Math.floor(Math.random() * playerPool.length)])
  const [cookies] = useCookies(["access_token"])
  const jwtToken = cookies.access_token
  const headers = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (cookies.access_token) {
      axios.get("http://localhost:3001/auth/players", { headers })
        .then((response) => {
          setPlayers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function addPlayer(name) {
    if (!players.includes(name)) {
      axios.post("http://localhost:3001/auth/add-player", { player: name }, { headers })
        .then(() => {
          setPlayers((currentPlayers) => [name, ...currentPlayers]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function clearPlayers() {
    setPlayers([])
  }

  useEffect(() => {
    updatePlayer()
  }, [correctCounter])

  function handleSubmit(event) {
    event.preventDefault()
    let guess = event.target.elements.inputField.value
    console.log(guess)
    console.log(playerName)
    if (guess === playerName) {
      setStatus("correct")
      setPlayerName(playerPool[Math.floor(Math.random() * playerPool.length)])
      addPlayer(playerName)
      correctCounter += 1
      console.log(players)
    } else {
      setStatus("incorrect")
    }
    console.log(status)

    event.target.elements.inputField.value = ""
  }

  function updatePlayer() {
    axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`)
      .then(res => {
        setPlayer(res.data.player[0])
      }).catch(error => {
        console.log(error)
      })
  }

  return (
    <>
      {/* <h3 className="prompt-title">Hint</h3> */}
      <div className="prompt">
        <Hint player={player} />
        <form onSubmit={handleSubmit}>
          <input
            className="guess-input"
            type="text"
            placeholder="Guess here!"
            name="inputField"
          />
          {(status === "correct") && <span className="status-correct">Correct</span>}
          {(status === "incorrect") && <span className="status-incorrect">Incorrect</span>}
          <button className="submit-button" type="submit">Submit</button>
        </form>
      </div>
      {/* <h3 className="players-title">Your Players</h3> */}
      <PlayerCollection playerNames={players} />
      <button
        className="clear-button" onClick={clearPlayers}>Clear Players</button>
    </>
  );
}
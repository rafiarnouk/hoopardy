import React, { useState, useEffect } from "react"
import axios from "axios"
import "./styles.css"

export default function PlayerCollection({ playerNames }) {
    const [players, setPlayers] = useState([]);
    const [added, setAdded] = useState([]);

    useEffect(() => {
        async function fetchPlayers() {
            const newPlayers = []

            for (const playerName of playerNames) {
                if (!added.includes(playerName)) {
                    const res = await axios.get(
                        `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`
                    )

                    const playerData = res.data.player[0]
                    if (playerData) {
                        newPlayers.push(playerData)
                        setAdded(prevAdded => [...prevAdded, playerName])
                    }
                }
            }

            setPlayers(prevPlayers => [...newPlayers.filter(Boolean), ...prevPlayers])
            setAdded(prevAdded => [...prevAdded, ...playerNames])
        }

        fetchPlayers()
    }, [playerNames])

    return (
        <>
            {players.length === 0 && <p className="message">Log in and start playing to collect players.</p>}
            <div className="player-cards">
                {players.map((p, i) => {
                    return <div className="player-card" key={i}>
                        <img className="player-card-icon" src={p.strCutout}></img>
                        <div className="player-card-info">
                            <h2 className="player-card-title">{p.strPlayer}</h2>
                            <p className="player-card-team">{p.strTeam}</p>
                        </div>
                        {(p.strNumber !== "") ? <h2 className="player-card-number">#{p.strNumber}</h2> : <h2 className="player-card-number">#0</h2>}
                    </div>
                })}
            </div>
        </>
    )
}
import React, { useState, useEffect } from "react"
import "./styles.css"

const minSentenceLength = 30

export default function Hint({ player }) {
    const [sentence, setSentence] = useState("")

    useEffect(() => {
        setSentence(censorSentence(getRandomSentence(getSentences(player.strDescriptionEN))))
    }, [player])

    function getSentences(passage) {
        if ((passage === undefined) || (passage === null)) { return null }
        let res = []
        let currentSentence = ""
        for (let i = 0; i < passage.length; i++) {
            let char = passage[i]
            if (char === ".") {
                currentSentence = currentSentence + char
                res.push(currentSentence)
                currentSentence = ""
            } else {
                currentSentence = currentSentence + char
            }
        }
        if (currentSentence !== "") {
            res.push(currentSentence)
        }
        return res.filter((s) => s.length > minSentenceLength)
    }

    function getRandomSentence(sentences) {
        if (sentences === null) { return null }
        const randIndex = Math.floor(Math.random() * sentences.length)
        return sentences[randIndex]
    }

    function censorSentence(sentence) {
        if (sentence === null) { return null }

        // get parts of player name 
        // "lebron james" -> "lebron", "james"
        let playerNameParts = []
        let currentPart = ""
        for (let i = 0; i < player.strPlayer.length; i++) {
            let char = player.strPlayer[i]
            if (char !== " ") {
                currentPart = currentPart + char
            } else {
                playerNameParts.push(currentPart)
                currentPart = ""
            }
        }
        playerNameParts.push(currentPart)
        console.log(playerNameParts)

        // update sentence censoring any player name parts
        // "curry broke the record" -> "[PLAYER NAME] broke the record"

        let res = ""
        let currentWord = ""

        for (let i = 0; i < sentence.length; i++) {
            let char = sentence[i]
            if (char === " ") {
                currentWord = currentWord + char
                res = res + currentWord
                currentWord = ""
            } else {
                currentWord = currentWord + char
            }
            for (const part of playerNameParts) {
                if ((currentWord === part) || (currentWord === `\r\n\r\n${part}`)) {
                    res = res + "[HIDDEN]"
                    currentWord = ""
                }
            }
        }
        res = res + currentWord
        return res
    }

    return (
        <p className="hint">{sentence}</p>
    )
}
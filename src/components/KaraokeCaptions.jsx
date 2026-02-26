"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useInterval } from "@washingtonpost/custom-template-utils/hooks";

import { Box } from "@washingtonpost/wpds-ui-kit";

const data = {
  task: "transcribe",
  language: "english",
  duration: 20.559999465942383,
  text: "Okay, recording another test audio file. This time I want to make it a little bit longer. I also want to talk a little bit faster, a little bit slower to see if the animation reflects that pace.",
  words: [
    { word: "Okay", start: 0, end: 1.0199999809265137 },
    {
      word: "recording",
      start: 1.340000033378601,
      end: 1.7000000476837158,
    },
    {
      word: "another",
      start: 1.7000000476837158,
      end: 2.8399999141693115,
    },
    { word: "test", start: 2.8399999141693115, end: 3.619999885559082 },
    { word: "audio", start: 3.619999885559082, end: 4.159999847412109 },
    { word: "file", start: 4.159999847412109, end: 4.579999923706055 },
    { word: "This", start: 5.519999980926514, end: 5.659999847412109 },
    { word: "time", start: 5.659999847412109, end: 6.21999979019165 },
    { word: "I", start: 6.21999979019165, end: 6.900000095367432 },
    { word: "want", start: 6.900000095367432, end: 7.579999923706055 },
    { word: "to", start: 7.579999923706055, end: 8.039999961853027 },
    { word: "make", start: 8.039999961853027, end: 8.600000381469727 },
    { word: "it", start: 8.600000381469727, end: 8.760000228881836 },
    { word: "a", start: 8.760000228881836, end: 8.84000015258789 },
    { word: "little", start: 8.84000015258789, end: 8.960000038146973 },
    { word: "bit", start: 8.960000038146973, end: 9.779999732971191 },
    {
      word: "longer",
      start: 9.779999732971191,
      end: 9.779999732971191,
    },
    { word: "I", start: 11, end: 11.5 },
    { word: "also", start: 11.5, end: 11.9399995803833 },
    { word: "want", start: 11.9399995803833, end: 12.279999732971191 },
    { word: "to", start: 12.279999732971191, end: 12.359999656677246 },
    { word: "talk", start: 12.359999656677246, end: 12.65999984741211 },
    { word: "a", start: 12.65999984741211, end: 12.84000015258789 },
    {
      word: "little",
      start: 12.84000015258789,
      end: 12.979999542236328,
    },
    { word: "bit", start: 12.979999542236328, end: 13.220000267028809 },
    {
      word: "faster",
      start: 13.220000267028809,
      end: 13.520000457763672,
    },
    { word: "a", start: 13.779999732971191, end: 13.880000114440918 },
    {
      word: "little",
      start: 13.880000114440918,
      end: 13.880000114440918,
    },
    { word: "bit", start: 13.880000114440918, end: 14.420000076293945 },
    {
      word: "slower",
      start: 14.420000076293945,
      end: 14.420000076293945,
    },
    { word: "to", start: 14.420000076293945, end: 14.760000228881836 },
    { word: "see", start: 14.760000228881836, end: 15.15999984741211 },
    { word: "if", start: 15.15999984741211, end: 15.720000267028809 },
    { word: "the", start: 15.720000267028809, end: 17.139999389648438 },
    {
      word: "animation",
      start: 17.139999389648438,
      end: 17.860000610351562,
    },
    {
      word: "reflects",
      start: 18.700000762939453,
      end: 19.520000457763672,
    },
    { word: "that", start: 19.520000457763672, end: 19.81999969482422 },
    { word: "pace", start: 19.81999969482422, end: 20.200000762939453 },
  ],
  usage: { type: "duration", seconds: 21 },
};

/**
 * Play / Pause handling
 * Pull in audio file
 * Static version first - swap over to Audio element once user clicks
 *
 *
 * time, setTime
 * timeBasedOnAudio
 *
 */

const KaraokeQuotes = (props) => {
  const { element } = props; // props included your raw_html element can be defined here
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [play, setPlay] = useState(true);
  const audioElement = useRef();
  const oneSecond = 1000;
  const fps = 20;
  const framesPerSecondInMilliseconds = 200;

  const duration = data.duration * 1000;
  const dataLength = data.words.length;

  const lastSubtitleActive = data.words.reduce((prev, current, i) => {
    return current.start * 1000 < time ? i : prev;
  });

  useInterval(() => {

    
    if (time <= duration) {
      setTime(
        (prev) => parseInt(prev) + parseInt(framesPerSecondInMilliseconds),
      );
    }
  }, framesPerSecondInMilliseconds);

  return (
    <div
      css={{ margin: "50vh auto" }}
      className={"white"}
      data-component="KaraokeQuotes"
      data-file="elements/KaraokeQuotes.js"
    >
      <>
        <div
          className={`left `}
          style={{ position: "absolute", top: "0%", left: "0%" }}
        >
          <p className={"sub-parent"} style={{}}>
            {data.words.map(({ word, start }, i) => {
              return (
                <span
                  style={{
                    color: lastSubtitleActive <= i ? "" : "gray",
                    display: lastSubtitleActive >= i ? "" : "none",
                    fontSize: "22px",
                  }}
                  className={"franklin font-md left"}
                  key={`c-${i}`}
                >
                  <>{word}</>
                  {i < data.words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </p>
        </div>
      </>
    </div>
  );
};
export { KaraokeQuotes as default };

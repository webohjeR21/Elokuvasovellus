import React, { useState, useEffect } from 'react';
import axios from 'axios';
const XMLParser = require('react-xml-parser');

function ShowSchedule() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    getXml();
  }, []);

  async function getXml() {
    try {
      const result = await axios.get('https://www.finnkino.fi/xml/Schedule?area=1018');
      const parsedData = new XMLParser().parseFromString(result.data);

      const showsArray = parsedData.getElementsByTagName('Show');
      const nextShows = showsArray.slice(0, 10).map(show => {
        const id = show.getElementsByTagName('ID')[0].value;
        const title = show.getElementsByTagName('Title')[0].value;
        const startTimeStr = show.getElementsByTagName('dttmShowStart')[0].value;
        const endTimeStr = show.getElementsByTagName('dttmShowEnd')[0].value;
        const startTime = new Date(startTimeStr);
        const endTime = new Date(endTimeStr);
        const theater = show.getElementsByTagName('Theatre')[0].value;
        const auditorium = show.getElementsByTagName('TheatreAuditorium')[0].value;
        const imageUrl = show.getElementsByTagName('Images')[0].getElementsByTagName('EventMediumImagePortrait')[0].value;

        return {
          id,
          title,
          startTime,
          endTime,
          theater,
          auditorium,
          imageUrl
        };
      });

      setShows(nextShows);
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  function getRuntime(startTime, endTime) {
    const runtimeMinutes = Math.round((endTime - startTime) / 1000 / 60);
    const hours = Math.floor(runtimeMinutes / 60);
    const minutes = runtimeMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  return (
    <div>
      <h1>10 näytöstä oulussa</h1>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            <div>Title: {show.title}</div>
            <div>Date: {formatDate(show.startTime)}</div>
            <div>Time: {formatTime(show.startTime)}</div>
            <div>Runtime: {getRuntime(show.startTime, show.endTime)}</div>
            <div>Theater: {show.theater}</div>
            <div>Auditorium: {show.auditorium}</div>
            <img src={show.imageUrl} alt={show.title} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowSchedule;

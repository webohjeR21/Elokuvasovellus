import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './naytos.css';
const XMLParser = require('react-xml-parser');

function ShowSchedule() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    getXml();
  }, []);

  //noutaa xml datan
  async function getXml() {
    try {
      const result = await axios.get('https://www.finnkino.fi/xml/Schedule?area=1018&nrOfDays=3');
      const parsedData = new XMLParser().parseFromString(result.data);
      console.log(parsedData);
      const showsArray = parsedData.getElementsByTagName('Show');
      const currentTime = new Date();
  
      const nextShows = showsArray.map(show => {
        const startTimeStr = show.getElementsByTagName('dttmShowStart')[0].value;
        const startTime = new Date(startTimeStr);

        //sijoittaa tiedot vakioihin jos ne eivät ole vielä alkaneet
        if (startTime > currentTime) {
          const id = show.getElementsByTagName('ID')[0].value;
          const title = show.getElementsByTagName('Title')[0].value;
          const endTimeStr = show.getElementsByTagName('dttmShowEnd')[0].value;
          const endTime = new Date(endTimeStr);
          const theater = show.getElementsByTagName('Theatre')[0].value;
          const auditorium = show.getElementsByTagName('TheatreAuditorium')[0].value;
          const imageUrl = show.getElementsByTagName('Images')[0].getElementsByTagName('EventMediumImagePortrait')[0].value;
          const showUrl = show.getElementsByTagName('ShowURL')[0].value;
          const eventUrl = show.getElementsByTagName('EventURL')[0].value;
  
          return {
            id,
            title,
            startTime,
            endTime,
            theater,
            auditorium,
            imageUrl,
            showUrl,
            eventUrl,
          };
        }
        return null;
      }).filter(Boolean);
  
      setShows(nextShows);
    } catch (error) {
      console.log(error);
    }
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
    <div style={{display: 'flex', flexWrap: 'wrap' }}>
      {shows.map(show => (
        <div key={show.id} className="show-card">
          <a href={show.eventUrl} target="_blank" rel="noopener noreferrer">
            <img src={show.imageUrl} alt={show.title} />
          </a>
          <div className="show-details">
            <div><h2><a href={show.showUrl} target="_blank" rel="noopener noreferrer">{show.title}</a></h2></div>
            <div>Pvm: {formatDate(show.startTime)}</div>
            <div>Klo: {formatTime(show.startTime)}</div>
            <div>Kesto: {getRuntime(show.startTime, show.endTime)}</div>
            <div>Teatteri: {show.theater}</div>
            <div>Auditorio: {show.auditorium}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShowSchedule;

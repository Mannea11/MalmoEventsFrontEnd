import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BillettoComponent.css';

const EventComponent = ({ apiUrls }) => {
  const [events, setEvents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const allEvents = await Promise.all(apiUrls.map(async (url, index) => {
        try {
          const response = await fetch(url);
          const jsonData = await response.json();
          let source;

          if (urlIncludesTicketmaster(url)) {
            source = 1;
          } else if (urlIncludesBilletto(url)) {
            source = 0;
          } else if (urlIncludesTickster(url)) {
            source = 2;
          } else {
            console.error('Unknown source for URL:', url);
            return [];
          }

          return jsonData.map(event => ({ ...event, source }));
        } catch (error) {
          console.error('Error fetching data from', url, ':', error);
          return [];
        }
      }));

      const sortedEvents = allEvents.flat().sort((a, b) => new Date(a.startDate || a.dateTime) - new Date(b.startDate || b.dateTime));
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiUrls]);

  const venueNames = [...new Set(events.map(event => event.venueName))];

  const isTitleLong = (title) => title && title.length > 20;

  const getDefaultImage = () => 'https://i.imgur.com/IDoyRMI.jpeg';

  const getVenueImage = (event) => event.image || getDefaultImage();

  const handleEventClick = (eventId, source) => {
    switch (source) {
      case 0:
        navigate(`/billettoEvent/${eventId}`);
        break;
      case 1:
        navigate(`/ticketmasterEvent/${eventId}`);
        break;
      case 2:
        navigate(`/ticksterEvent/${eventId}`);
        break;
      default:
        console.error('Unknown source:', source);
    }
  };

  const handleVenueChange = (event) => {
    setSelectedVenue(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setSelectedDateFilter(event.target.value);
  };

  const currentDate = new Date();

  const isToday = (dateString) => {
    const eventDate = new Date(dateString);
    return eventDate.toDateString() === currentDate.toDateString();
  };

  const isWithinComingWeek = (dateString) => {
    const eventDate = new Date(dateString);
    const oneWeekLater = new Date(currentDate);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    return eventDate >= currentDate && eventDate <= oneWeekLater;
  };

  const isWithinComingMonth = (dateString) => {
    const eventDate = new Date(dateString);
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    return eventDate >= currentDate && eventDate <= oneMonthLater;
  };

  const filteredEvents = events.filter((event) => {
    const venueFilter = selectedVenue.toLowerCase();
    const title = event.venueName.toLowerCase();


    if (selectedVenue && title.indexOf(venueFilter) === -1) {
      return false;
    }


    switch (selectedDateFilter) {
      case 'today':
        return isToday(event.startDate || event.dateTime);
      case 'week':
        return isWithinComingWeek(event.startDate || event.dateTime);
      case 'month':
        return isWithinComingMonth(event.startDate || event.dateTime);
      default:
        return true;
    }
    
  });

  return (
    <div>
      <div className="filter-container">
        <div>
          <select id="venueFilter" onChange={handleVenueChange} value={selectedVenue}>
            <option value="">Alla lokaler</option>
            {venueNames.map((venue, index) => (
              <option key={index} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select id="dateFilter" onChange={handleDateFilterChange} value={selectedDateFilter}>
            <option value="all">Alla datum</option>
            <option value="today">Idag</option>
            <option value="week">Inom 7 dagar</option>
            <option value="month">Inom 30 dagar</option>
          </select>
        </div>
      </div>
      <div className="events-container">
        <ul className="event-list">
          {filteredEvents.map(event => (
            <li key={event.id} className="event-item">
              <div className="event-content" onClick={() => handleEventClick(event.id, event.source)}>
                <img src={getVenueImage(event)} alt={event.title} className="event-image" />
                <h3 className={`event-title ${isTitleLong(event.title) ? 'event-title-small' : ''}`}>
                  {event.title}
                </h3>
                <p className="event-info">{event.organiser || event.venueName || ''}</p>
                <p className="event-info">{formatDate(event.startDate || event.dateTime || 'Unknown')}</p>
                <p className="event-info">{event.endDate ? formatDate(event.endDate) : ''}</p>
                <button className="more-info-button">Mer Info</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
  return new Date(dateString).toLocaleString(undefined, options);
};

const urlIncludesTicketmaster = (url) => url.includes('ticketmaster');
const urlIncludesBilletto = (url) => url.includes('billetto');
const urlIncludesTickster = (url) => url.includes('tickster');

export default EventComponent;

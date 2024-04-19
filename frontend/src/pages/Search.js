import React, { Component } from 'react';
import ApiHaku from './ApiHaku';
import './Search.css';

export default class Search extends Component {
  state = {
    hakuTermi: '',
    valittuVuosi: '',
    valittuTyyppi: '',
    valittuSort: 'default',
    sivuNumero: 1,
    hakuTulos: null,
  };

  handleMuutos = (event) => {
    this.setState({ hakuTermi: event.target.value });
  };

  handleVuosi = (event) => {
    this.setState({ valittuVuosi: event.target.value });
  };

  handleTyyppi = (event) => {
    this.setState({ valittuTyyppi: event.target.value });
  };

  handleSort = (event) => {
    this.setState({ valittuSort: event.target.value });
  };

  handleHakuNappi = async () => {
    const { hakuTermi, valittuVuosi, valittuTyyppi, sivuNumero } = this.state;
    try {
      const result = await ApiHaku(hakuTermi, valittuVuosi, valittuTyyppi, sivuNumero);
      this.setState({ hakuTulos: result });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  takaisinAlkuun = () => {
    this.setState({sivuNumero: 1});

  }

  handleSuodatinReset = () => {
    this.setState({
      valittuVuosi: '',
      valittuTyyppi: '',
      valittuSort: 'default',
    }, this.handleHakuNappi);
  };

  handleSeurSivu = async () => {
    this.setState(prevState => ({ sivuNumero: prevState.sivuNumero + 1 }), this.handleHakuNappi);
  };

  handleEdlSivu = async () => {
    if (this.state.sivuNumero > 1) {
      this.setState(prevState => ({ sivuNumero: prevState.sivuNumero - 1 }), this.handleHakuNappi);
    }
  };

  sortHakuTulos = () => {
    const { hakuTulos, valittuSort } = this.state;
    if (!hakuTulos || hakuTulos.Response !== 'True') return [];

    let sortedTulos = [...hakuTulos.Search];

    switch (valittuSort) {
      case 'yearAsc':
        sortedTulos.sort((a, b) => a.Year.localeCompare(b.Year));
        break;
      case 'yearDesc':
        sortedTulos.sort((a, b) => b.Year.localeCompare(a.Year));
        break;
      case 'aakkoset':
        sortedTulos.sort((a, b) => a.Title.localeCompare(b.Title));
        break;
      default:
        break;
    }

    return sortedTulos;
  };

  renderhakuTulos = () => {
    const sortedTulos = this.sortHakuTulos();
    return (
      <div className="movie-grid">
        {sortedTulos.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} alt={movie.Title} className="movie-poster" />
            <div className="movie-details">
              <h2><a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noopener noreferrer">{movie.Title}</a></h2>
              <div>Vuosi: {movie.Year}</div>
              <div>Tyyppi: {movie.Type}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { hakuTermi, valittuSort, valittuVuosi, valittuTyyppi } = this.state;
    return (
      
      <div className="container">
        <div className="page-buttons">
            <button className='nappula-slot' onClick={this.handleEdlSivu} disabled={this.state.sivuNumero === 1}>Edllinen</button>
            <button className='nappula-slot' onClick={this.handleSeurSivu}>Seuraava</button>
            <button className='nappula-slot' onClick={async () => {await this.takaisinAlkuun(); this.handleHakuNappi();  }}>Takaisin alkuun</button>
          </div>
        <div className="search-bar">
          <input
            type="text"
            value={hakuTermi}
            onChange={this.handleMuutos}
            placeholder="Hae elokuvia!"
            className="search-input"
          />
          <div className="filter-dropdown">
          <button onClick={async () => {await this.takaisinAlkuun(); this.handleHakuNappi();  }} className="search-button">
              Hae
            </button>
          <select value={valittuVuosi} onChange={this.handleVuosi} className="filter-select">
              <option value="">Valitse Vuosi</option>
              {Array.from({ length: new Date().getFullYear() - 1900 }, (_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>{new Date().getFullYear() - index}</option>
              ))}
            </select>
            <select value={valittuTyyppi} onChange={this.handleTyyppi} className="filter-select">
              <option value="">Valitse Tyyppi</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="episode">Episode</option>
            </select>
            <select value={valittuSort} onChange={this.handleSort} className="filter-select">
              <option value="default">Valitse järjestys</option>
              <option value="yearAsc">Vuosi (vahnin ensin)</option>
              <option value="yearDesc">Vuosi (uusin ensin)</option>
              <option value="aakkoset">Aakkoset</option>
            </select>
            <button onClick={this.handleSuodatinReset} className="reset-button">Nollaa Suodattimet</button>
          </div >
          
        </div>
        {this.renderhakuTulos()}
      </div>
    );
  }
}

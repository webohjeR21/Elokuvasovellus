import React, { Component } from 'react';
import Api from './ApiHaku';
import './Search.css';
import { Link } from 'react-router-dom';

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
    if (hakuTermi !== ''){
      try {
        const result = await Api.ApiHaku(hakuTermi, valittuVuosi, valittuTyyppi, sivuNumero);
        this.setState({ hakuTulos: result });
      } catch (error) {
        console.error('error', error);
      }
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


  renderHakuTulos = () => {
    const sortedTulos = this.sortHakuTulos();
    return (
      <div className="leffa-grid">
        {sortedTulos.map((movie) => (
          <div key={movie.imdbID} className="leffa-kortti">
            <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} alt={movie.Title} className="leffa-juliste" />
            <div className="leffa-tiedot">
              <h2><a href={`https://www.imdb.com/title/${movie.imdbID}`} target="_blank" rel="noopener noreferrer">{movie.Title}</a></h2>
              <div>Vuosi: {movie.Year}</div>
              <div>Tyyppi: {movie.Type}</div>
              <Link to={`/arvostelu/${movie.imdbID}`} className="arvostelu-nappi">Arvostele</Link>
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
        <footer className="sivun-vaihto">
            <button className='nappula-slot' onClick={this.handleEdlSivu} disabled={this.state.sivuNumero === 1}>Edllinen</button>
            <button className='nappula-slot' onClick={this.handleSeurSivu}>Seuraava</button>
            <button className='nappula-slot' onClick={async () => {await this.takaisinAlkuun(); this.handleHakuNappi();  }}>Takaisin alkuun</button>
            <p className='sivu-numero'>Sivu: {this.state.sivuNumero}</p>
        </footer>
        <div className="haku-palkki">
          <input
            type="text"
            value={hakuTermi}
            onChange={this.handleMuutos}
            placeholder="Hae elokuvia!"
            className="haku-teksti"
          />
          <div className="haku-nappi-div">
          <button onClick={async () => {await this.takaisinAlkuun(); this.handleHakuNappi();  }} className="haku-nappi">
              Hae
            </button>
          </div >
        </div>
        <div className="valinnat">
        <select value={valittuVuosi} onChange={this.handleVuosi} className="suodatin-valinnat">
              <option value="">Valitse Vuosi</option>
              {Array.from({ length: new Date().getFullYear() - 1900 }, (_, index) => (
                <option key={index} value={new Date().getFullYear() - index}>{new Date().getFullYear() - index}</option>
              ))}
            </select>
            <select value={valittuTyyppi} onChange={this.handleTyyppi} className="suodatin-valinnat">
              <option value="">Valitse Tyyppi</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="episode">Episode</option>
            </select>
            <select value={valittuSort} onChange={this.handleSort} className="suodatin-valinnat">
              <option value="default">Valitse järjestys</option>
              <option value="yearAsc">Vuosi (vahnin ensin)</option>
              <option value="yearDesc">Vuosi (uusin ensin)</option>
              <option value="aakkoset">Aakkoset</option>
            </select>
            <button onClick={this.handleSuodatinReset} className="suodatin-valinnat">Nollaa Suodattimet</button>
        </div>
        {this.renderHakuTulos()}
      </div>
    );
  }
}

import React, { Component, useState } from "react";
import { Button, Card, Navbar } from "react-bootstrap/";
import "./App.css";

import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

// this is the old way
class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {
        songName: "Not Checked",
        albumArt: "https://place-hold.it/150",
        songArtist: "Not Checked",
      },
      userInfo: { username: "", profileLink: "" },
    };
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getUserInfo() {
    spotifyApi.getMe().then((response) => {
      this.setState({
        userInfo: {
          username: response.item.id,
          profileLink: response.item.external_urls.spotify,
        },
      });
    });
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      this.setState({
        nowPlaying: {
          songName: response.item.name,
          songArtist: response.item.artists[0].name,
          albumArt: response.item.album.images[0].url,
          albumName: response.item.album.name,
        },
      });
    });
  }

  render() {
    console.log(this.state.loggedIn);
    console.log(this.state.userInfo);
    return (
      <div class="App">
        <Navbar>
          <Navbar.Brand href="#">Spotify Playlist Generator</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {this.state.loggedIn === true && (
              <Navbar.Text id="signedInAs">
                Signed in as:{this.state.userInfo.username}
                <a href={this.state.userInfo.profileLink} target="_blank">
                  {this.state.userInfo.username}
                </a>
              </Navbar.Text> // TODO: Make this show username
            )}
          </Navbar.Collapse>
        </Navbar>
        {this.state.loggedIn === false && (
          <Button
            variant="success"
            size="sm"
            href="http://localhost:8888"
            id="loginButton"
          >
            {" "}
            Login to Spotify{" "}
          </Button>
        )}
        <Card className="text-center">
          <Card.Body>
            <Card.Title>Now Playing</Card.Title>
            <Card.Text>
              {this.state.nowPlaying.songName} by{" "}
              {this.state.nowPlaying.songArtist}
              <div>
                <img
                  src={this.state.nowPlaying.albumArt}
                  class="rounded"
                  width="150"
                  height="150"
                ></img>
              </div>
            </Card.Text>
            <Button variant="primary" onClick={() => this.getNowPlaying()}>
              Check Now Playing
            </Button>
          </Card.Body>
          <Card.Footer className="text-muted">Make sure you're playing something!</Card.Footer>
        </Card>
      </div>
    );
  }
}

export default App;

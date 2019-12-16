import React from 'react';
import './App.css';
import {
  HashRouter,
  Route,
} from 'react-router-dom';
import { API } from './constants';
import axios from 'axios';

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Route exact path='/' component={Add}></Route>
      </HashRouter>
    )
  }
}
class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashes: "",
      response: "",
      streams: [],
    }
    this.get_streams();
  }
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Arweave Data Archiver</h1>
        <p>Periodically archives endpoint to arweave</p>
        <br />
        <textarea
          style={{
            height: 300,
            width: 600,
            borderWidth: 0,
            fontSize: 15,
          }}
          onChange={(e) => {
            this.setState({ hashes: e.target.value });
          }} placeholder="Paste url to add to archiver" />
        <br />
        <button style={{
          color: "blue",
          padding: 10,
          width: 600,
          cursor: "pointer",
        }}
          onClick={(e) => {
            this.add(this.state.hashes);
          }}
        >Archive this to Arweave</button>
        <br />
        <div style={{
          margin: "auto",
          marginTop: 30,
          background: "#cbcbcb",
          padding: 20,
          width: 800,
        }}>

          {this.state.response ? <PrettyPrintJson data={this.state.response}></PrettyPrintJson> : ""}
        </div>

        <br />
        <div style={{
          margin: "auto",
          marginTop: 30,
          padding: 20,
          width: 800,
        }}>
          <h3> Current Data-Streams Being archived</h3>
          {this.state.streams.map(o => {
            return (
              <div><a href={`https://viewblock.io/arweave/tx/${o.id}`}>{o.url}</a></div>
            )
          })}
        </div>
      </div>)
  }
  get_streams = async () => {
    try {
      let streams = (await axios.get(`${API}/get_current_streams`)).data;

      this.setState({ streams: streams })
    } catch (e) {
      alert("Some technical error check console");
      console.error(e)
    }
  }

  add = async (hashes) => {
    alert("Sent to server! Wait for txid!");
    try {
      let respones = (await axios.post(`${API}/add`, {
        url: hashes
      })).data;

      this.setState({ response: respones })
    } catch (e) {
      alert("Some technical error check console");
      console.error(e)
    }
  }
}

class PrettyPrintJson extends React.Component {
  render() {
    const { data } = this.props;
    const url = `https://viewblock.io/arweave/tx/${data}`;
    return (<div>{`Response arweave txid: `}<a href={url}>{data}</a></div>);
  }
}

export default App;

import React, { useState } from 'react';
import Axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import io from 'socket.io-client';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

function App() {
  const [ state, setState ] = useState({
    response: null,
    endpoint: 'http://127.0.0.1:5000', 
    message: '', 
    user: '',
  })

  const [ socketMsg, setSocketMsg ] = useState('')

  const classes = useStyles();  
  const socket = io(state.endpoint);

  let handleChange = (e) => {
    setState({
      ...state, 
      [e.target.name]: e.target.value
    });
  }


  let handleSubmit = (e) => {
    e.preventDefault();
    socket.on("Chat", message => {
      console.log('MESSAGE FROM SERVER: ', message)
    })    
  }
  
  // socket.on("FromAPI", data => setState({ response: data }));

  console.log('STATE: ', state)
  console.log('DATA: ', socketMsg)
  return ([
    <div style={{ textAlign: "center" }}>
    {state.response
        ? <p>
          The temperature in Florence is: {state.response} °F
        </p>
        : <p>Loading...</p>}
  </div>,
<div>
  >>> Emma: {socketMsg}
</div>,
<form style={{ display: "flex", justifyContent:"center" }} className={classes.root} onSubmit={handleSubmit}>
  <TextField style={{ width: "800px" }} id="filled-basic" label="user handle" variant="filled" name="user" value={state.user} onChange={handleChange} />
  <TextField style={{ width: "800px" }} id="filled-basic" label="chat message" variant="filled" name="message" value={state.message} onChange={handleChange} />
  <Button type="submit">Send</Button>
</form>
  ]);
}

export default App;

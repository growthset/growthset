import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import * as uuidBase62 from 'uuid62';

export default function LaunchGuide(props: any) {

  // todo: type definitions - generated via server?
  const [url, setUrl] = useState('');

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleLaunch = () => {
    // TODO: Open new window based on entered URL
    // generate short UUID

    const id = '467t44649673';
    
    const w = window.open(url + "#odapEditor" + id);
    window.addEventListener('message', m => {
      console.log('handleLaunch: received message: ' + m);
      if (m.data === id) {
        console.log('handleLaunch: postMessage');
        w?.postMessage({type: 'opendap', jwt: '', guide: ''}, '*');
      } else {
        console.log('handleLaunch: wrong message received: ' + m);
      }
    }, true);
    props.setOpen(false);
  };

  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Launch Guide</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Develop your guide.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="url"
      label="URL"
      type="string"
      fullWidth
      value={url}
      onChange={(e) => setUrl(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleLaunch} color="primary">
      Launch
    </Button>
  </DialogActions>
</Dialog>);

}
import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

export default function GlobalEditor(props: any) {

  // todo: type definitions - generated via server?
  const [content, setContent] = useState('');
  useEffect(() => setContent(''), [props.open]);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleCreate = () => {
    props.createStep({type: 'global', content});
    // props.setContent('');
    props.setOpen(false);
  };

  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Create Global Step</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Create a new global step.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="content"
      label="Content"
      type="string"
      fullWidth
      multiline
      rows={4}
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleCreate} color="primary">
      Create
    </Button>
  </DialogActions>
</Dialog>);

}
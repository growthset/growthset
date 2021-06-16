import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

import { gql, useMutation } from '@apollo/client';

const CREATE_GUIDE = gql`
  mutation CreateGuide($guide: GuideInput!) {
    createGuide(guide: $guide) {
      id
      name
    }
  }
`;
export default function CreateGuide(props: any) {

  // todo: type definitions - generated via server?
  const [createGuide] = useMutation(CREATE_GUIDE, {
    refetchQueries: [
      { query: props?.GET_GUIDES }
    ]
  }); 
  const [name, setName] = useState('Untitled');

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSave = () => {
    createGuide({variables: {guide: {name}}} as any);
    props.setOpen(false);
  };

  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Create Guide</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Create a new guide.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="name"
      label="Name"
      type="string"
      fullWidth
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSave} color="primary">
      Create
    </Button>
  </DialogActions>
</Dialog>);

}
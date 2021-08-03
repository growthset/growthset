import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { gql, useQuery, useMutation } from '@apollo/client';
import Button from "@material-ui/core/Button";


const UPDATE_GUIDE = gql`
mutation UpdateGuide($guide: GuideInput!) {
  updateGuide(guide: $guide) {
    id
    name
  }
}
`;

const GET_GUIDES = gql`
query GetGuides {
  listGuides {
    id
    name
  }
}`;

export default function EditGuide(props: any) {
  console.log(props.guideName);
  const [nameText, setNameText] = React.useState(props.guideName);
  console.log('nameText = ' + nameText);

  useEffect(() => {
    setNameText(props.guideName);
  }, [props.guideName])

  const handleSave = () => {
    updateGuide({variables: {guide: {name: nameText, id: props.guide.id}}} as any)
    props.setOpen(false);
  };
  const handleCancel = () => {
    props.setOpen(false);
  };

  const [updateGuide] = useMutation(UPDATE_GUIDE, {
    refetchQueries: [
      { query: GET_GUIDES }
    ]
  });

 
  return (<div><Dialog open={props.open} onClose={handleCancel} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Edit Guide</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Edit {props.guide?.name}
    </DialogContentText>
    <DialogContentText>
      Guide Name
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="name"
      type="string"
      fullWidth
      value={nameText}
      onChange={(e) => setNameText(e.target.value)}
    />
  </DialogContent>

  <DialogActions>
  <Button onClick={handleCancel} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSave} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog></div>);

}
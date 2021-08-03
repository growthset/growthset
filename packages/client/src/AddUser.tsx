import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";


import { gql, useMutation } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($user: UserInput!) {
    createUser(user: $user) {
      local {
          email
      },
      role
    }
  }
`;
export default function AddUser(props: any) {

  const [addUser] = useMutation(CREATE_USER, {
    refetchQueries: [
      { query: props?.GET_USERS }
    ]
  }); 
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');


  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSave = () => {
    addUser({variables: {user: { local:{email, password: "password"}, role}}} as any);
    props.setOpen(false);
  };

  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Add User</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Add a new user.
    </DialogContentText>
    <TextField
      autoFocus
      margin="dense"
      id="email"
      label="E-mail"
      type="string"
      fullWidth
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />  
    <TextField
      autoFocus
      margin="dense"
      id="role"
      label="role"
      type="string"
      fullWidth
      value={role}
      onChange={(e) => setRole(e.target.value)}
    />  
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSave} color="primary">
      Add
    </Button>
  </DialogActions>
</Dialog>);

}
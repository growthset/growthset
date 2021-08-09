import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';






import { gql, useQuery, useMutation } from '@apollo/client';
import { isContext } from 'vm';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginTop: {
      marginTop: "25px"
    },
    marginBottom: {
      marginBottom: "-5px"
    }
    }),
  );


export default function ChangePassword(props: any) {
  const classes = useStyles();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
 
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const CHANGE_PASSWORD = gql `
    mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
      changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
        success
        errorMessage
      }
    }
  `;

  const [ changePassword, data] = useMutation(CHANGE_PASSWORD, {
    refetchQueries: [
      { query: props?.GET_USERS }
    ]
  });

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSave = () => {
    if (newPassword && newPassword2 && newPassword === newPassword2) {
      if (newPassword.length >= 7) {
        changePassword({variables: {newPassword: newPassword, oldPassword: oldPassword}} as any);
        setErrorMsg('');
        props.setOpen(false);
      } else {
        setErrorMsg('Password must be more than 7 characters!');
      }
     } else {
      setErrorMsg('Password are different!');
      }
  };


  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
  <DialogContent>
    <form noValidate autoComplete="off">
      <InputLabel htmlFor="old-password" className={classes.marginBottom}>Old Password</InputLabel>
       <Input
            id="old-password"
            type={showPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => {setOldPassword(e.target.value)}}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
      <InputLabel htmlFor="new-password" className={`${classes.marginTop} ${classes.marginBottom}`}>New Password</InputLabel>
        <Input
             error={errorMsg != ''}
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {setNewPassword(e.target.value)}}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
      <InputLabel htmlFor="new-password2" className={`${classes.marginTop} ${classes.marginBottom}`}>Repeat New Password</InputLabel>
       <Input
            error={errorMsg != ''}
            id="new-password2"
            type={showPassword ? 'text' : 'password'}
            value={newPassword2}
            onChange={(e) => {setNewPassword2(e.target.value)}}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
    </form>
    <p>{errorMsg}</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSave} color="primary">
      Change
    </Button>
  </DialogActions>
</Dialog>);

}
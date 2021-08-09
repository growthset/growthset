import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

export default function SaveConfirmation(props: any) {
  const handleClose = () => {
    props.setOpen(false);
  };

  const handleCreate = () => {
    props.setOpen(false);
  };

  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Save Guide</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Do you want to save your changes?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleCreate} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog>);

}
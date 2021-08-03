import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";


import { gql, useMutation, useQuery} from '@apollo/client';

const CREATE_SITE = gql`
  mutation CreateSite($site: SiteInput!) {
    createSite(site: $site) {
      siteURL
      id
    }
  }
`;

export default function AddSite(props: any) {


  // Todo: Finish Validator
  const validURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return true || !!pattern.test(str);
  };

  const [createSite] = useMutation(CREATE_SITE, {
      refetchQueries: [
        { query: props?.GET_SITES }
      ]
  });

  const [name, setName] = useState('Untitled');
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);
 
  const { loading, error, data } = useQuery(props?.GET_SITES);

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleSave = () => {
    let newSite = true;
    data?.listSites.map((item: any) => {
      if (name === item.siteURL) {
        newSite = false;
        console.log("Duplicate URL!");
        setErrorMsg("Duplicate URL!");
        setIsError(true);
      }
    });
    if (!validURL(name)) {
      console.log("URL invalid!")
      setErrorMsg("URL invalid!");
      setIsError(true);

    }
    if (newSite && validURL(name)) {
      createSite({variables: {site: {siteURL: name}}} as any);
      props.setOpen(false);
    }
  };

  return (<Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Add Site</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Add a new Site
    </DialogContentText>
    <TextField
      error={isError}
      autoFocus
      margin="dense"
      id="name"
      label="Name"
      type="string"
      fullWidth
      value={name}
      helperText={errorMsg}
      onChange={(e) => setName(e.target.value)}
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
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import * as uuidBase62 from 'uuid62';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { List } from '@material-ui/core';
import AddSite from './AddSite';
import { gql, useQuery, useMutation } from '@apollo/client';

const DELETE_SITE = gql`
mutation DeleteSite ($siteURL: String!) {
  deleteSite (siteURL: $siteURL) {
    success
    errorMessage
  } 
}
`;

export default function LaunchGuide(props: any) {
  const GET_SITES = gql`
    query GetSites {
      listSites {
        id
        siteURL
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_SITES);
  const [ deleteSite] = useMutation(DELETE_SITE, {
    refetchQueries: [
      { query: props?.GET_SITES }
    ]
  });

  const [openURL, setOpenURL] = React.useState(false);

  const [guide, setGuide] = React.useState<{id: null | string}>({id: null});
  const handleOpenGuide = (id: string) => {
      setGuide({id});
      setOpenURL(true);
  };
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
  const list = data?.listSites?.map((item: any) => {
    return <MenuItem value={item.siteURL}><a href={'#' + item.id}>{item.siteURL}</a></MenuItem>
  })
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setUrl(event.target.value as string);
  }
  const handleRemove = () => {
     deleteSite({variables: {siteURL: url}} as any);
  };
  return (<div>{loading ? 'Loading... ' : (error ? `Error! ${error.message}` : <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
  <DialogTitle id="form-dialog-title">Launch Guide</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Develop your guide.
    </DialogContentText>
    <Select
    autoFocus
    margin="dense"
    id="url"
    label="URL"
    type="string"
    fullWidth
    value={url}
    onChange={handleChange}>
      {list}
    </Select>
    <Button onClick={() => setOpenURL(true)} color="primary">
      + Add New Site
    </Button>
    <AddSite open={openURL} setOpen={setOpenURL} GET_SITES={GET_SITES}></AddSite>
    <br></br>
    { url ?
    <Button onClick={handleRemove} color="primary">
      X Remove Selected Site
    </Button>
    : null}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleLaunch} color="primary">
      Launch
    </Button>
  </DialogActions>
</Dialog>)}</div>);

}
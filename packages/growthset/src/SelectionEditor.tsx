import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import getCssSelector from 'css-selector-generator';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import _ from 'lodash';
import {Steps} from './guide';

// inspiration from https://github.com/cantino/selectorgadget/blob/master/lib/js/core/core.js.coffee
// but then found 'outline' CSS property, seems better 
/*
outline: 4px solid blue;
*/

let callback : any = null;
let oldElem : any = null;

const selectionClickListener = function (event: any) {
  // console.log('mouseover occurred on element ', event.target);
  // get reference to the element user clicked on
  const element: any = event.target;
  // get unique CSS selector for that element
  if (oldElem !== null && element !== oldElem) {
    oldElem?.classList?.remove('odap_selectionOutline');
  }
  element?.classList?.remove('odap_selectionOutline');

  oldElem = element;
  const selector = getCssSelector(element as any);
  // do whatever you need to do with that selector
  console.log('selector', selector);
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  // capturing really locks things down
  
  // TODO: This is really hacky
  callback('postselect', selector);
};

const selectionMouseOverListener = function (event: any) {
        // console.log('mouseover occurred on element ', event.target);
        // get reference to the element user clicked on
        const element: any = event.target;
        // get unique CSS selector for that element
        if (oldElem !== null && element !== oldElem) {
          oldElem?.classList?.remove('odap_selectionOutline');
        }
        element?.classList?.add('odap_selectionOutline');

        oldElem = element;
        //const selector = getCssSelector(element as any);
        // do whatever you need to do with that selector
        //console.log('selector', selector);
      };

const selectionMouseOutListener = function (event: any) {
        // console.log('mouseout occurred on element ', event.target);
        // get reference to the element user clicked on
        const element: any = event.target;
        element?.classList?.remove('odap_selectionOutline');
      };

export default function SelectionEditor(props: any) {

  const [content, setContent] = useState<any>('');
  const [selectionState, setSelectionState] = useState('preselect');
  const [selection, setSelection] = useState<any>(null);
  const [position, setPosition] = useState<any>('auto');

  const {steps}: {steps: Steps} = props;

  const edit = steps.hasCurrentStep(); // currentIndex != -1; // _.isObject(props?.step)
  const step = steps.getCurrentStep();

  console.log('edit ? ' + edit);

  useEffect(() => {
    console.log('useEffect');
    setContent(edit ? step?.content : '');
    setSelectionState(edit ? 'dialog' : 'preselect');
    setSelection(edit ? step?.selection : null);
    setPosition(edit ? step?.position : 'auto');
  }, [steps.getCurrentStep()]);

  const reset = () => {
    oldElem?.classList?.remove('odap_selectionOutline');
    props.setOpen(false);
    setSelectionState('preselect');
    setContent('');
    setPosition('auto');
  }

  const handleClose = () => {
    reset();
    props.cancel();
  };

  const handleCreate = () => {
    reset();
    if (edit) {
      steps.editCurrentStep({type: 'attach', content, selection, position});
    } else {
      steps.createStep({type: 'attach', content, selection, position});
    }
  };

  const handleRemove = () => {
    reset();
    steps.removeCurrentStep();
  };

  if (props.open && !edit && selectionState === 'preselect') {
    // register handlers
    document.body.addEventListener('click', selectionClickListener, {capture: true});
    document.body.addEventListener('mouseover', selectionMouseOverListener);
    document.body.addEventListener('mouseout', selectionMouseOutListener);
    callback = (selState: any, sel: any) => {
      console.log('callback: ' + selState);
      setSelectionState(selState);
      setSelection(sel);
    }
  } else if (props.open && selectionState === 'postselect') {
    // unregister
    document.body.removeEventListener('click', selectionClickListener, {capture: true});
    document.body.removeEventListener('mouseover', selectionMouseOverListener);
    document.body.removeEventListener('mouseout', selectionMouseOutListener);
    setSelectionState('dialog');
  }
  // Position Options:
  // 'auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'

  return (
    <Dialog open={props.open && selectionState === 'dialog'} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{ edit ? 'Edit' : 'Create'}  Selection Step</DialogTitle>
    <DialogContent>
        <DialogContentText>{ edit ? 'Edit selection step' : 'Create a new selection step' }</DialogContentText>
        <InputLabel id="position-label">Position</InputLabel>
        <Select
          labelId="position-label"
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value as string)}
        >
          <MenuItem value={'auto'}>Auto</MenuItem>
          <MenuItem value={'top'}>Top</MenuItem>
          <MenuItem value={'bottom'}>Bottom</MenuItem>
          <MenuItem value={'left'}>Left</MenuItem>
          <MenuItem value={'right'}>Right</MenuItem>
        </Select>

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
        {edit ? (<Button onClick={handleRemove} color="primary">Remove</Button>) : []}
        <Button onClick={handleCreate} color="primary">
        { edit ? 'Edit' : 'Create' }
        </Button>
    </DialogActions>
    </Dialog>
  );

}
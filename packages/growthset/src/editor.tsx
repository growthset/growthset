import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles, createMuiTheme, ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
// import MoreIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from '@material-ui/core/Button';
import _ from 'lodash';

// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// import Shepherd from 'shepherd.js';

import GlobalEditor from './GlobalEditor';
import SelectionEditor from './SelectionEditor';

import { Step, Steps, playGuide as play } from './guide';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});
const Editor = {
  shouldLaunchEditor: function () {
    const url = new URL(window.location.href);
    // TODO: Will probably encode one time UserAuth Token here?  Is there another better way to pass it?  How does Pendo do it?
    console.log('shouldLaunchEditor: ' + url + " h='" + url.hash + "'");
    const editorEnabled = url.hash?.startsWith('#odapEditor');

    if (editorEnabled) {
      console.log('shouldLaunchEditor: enabling editor...');
      const id = url.hash.substring('#odapEditor'.length);
      window.addEventListener('message', m => {
        console.log('shouldLaunchEditor: received message: ' + m);  
      }); // should we unregister this once complete?
      // if there is no opener, return false
      if (!_.isNull(window.opener)) {
        console.log('shouldLaunchEditor: postMessage');
        window.opener.postMessage(id, '*'); /* should we do something like this instead? {'src':'odap', 'type': 'activated', id: id}*/
        return true;
      }
    }
    return false;
  },
  launchEditor: function() {
    
    const generateClassName = createGenerateClassName({
      productionPrefix: 'c',
      seed: 'odap',
    });

    var elem = document.createElement('div');
    elem.id = 'odapRoot';
    // elem.style.cssText = 'display:none';
    document.body.appendChild(elem);

    // There really is no app ... need to render a panel attached to the north part of the screen
    const App = function() {
      const [onTop, setOnTop] = useState(true);
      const [showGlobal, setShowGlobal] = useState(false);
      const [showAttach, setShowAttach] = useState(false);
      const [steps, setSteps] = useState<any[]>([]);
      const [showAppBar, setShowAppBar] = useState(true);
      const [currentIndex, setCurrentIndex] = useState(-1);

      const useStyles = makeStyles((theme) => ({
        editor: {
          position: "fixed",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        },
        appBar: {
          top: props => (props as any).onTop ? 0 : 'auto',
          bottom: props => (props as any).onTop ? 'auto' : 0,
        },
        appBarHidden: {
          display: 'none'
        },
        grow: {
          flexGrow: 1,
        },
        button: {
          margin: theme.spacing(1),
        },
      }));

      const classes = useStyles({onTop});

      const guideList = [];
      const theSteps = new Steps(steps, setSteps, currentIndex, setCurrentIndex);

      /*
      const createStep = function(step: Step) {
        setSteps([...steps, step]);
      };

      const editStep = function(step: Step, index: number) {
        steps[index] = step;
        setSteps(steps);
      }

      const removeStep = function(index: number) {
        setSteps(steps.slice(index, index));
      }
      */

      const playGuide = function() {
        setShowAppBar(false);
        play(steps as Step[], () => setShowAppBar(true));
        /*
        const tour = new Shepherd.Tour({
          defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: true
          },
          useModalOverlay: true
        });
  
        for (let step = 0; step < steps.length; step++) {
          const stepDef: any = {
            id: 'step' + step,
            text: steps[step].content,
            classes: 'example-step-extra-class',
            buttons: [
              {
                text: (step != steps.length - 1) ? 'Next' : 'Finish',
                action: (step != steps.length - 1) ? tour.next : () => { tour.next(); setShowAppBar(true) },
              }
            ]
          }
          if (steps[step].type === 'attach') {
            console.log('attaching to: ' + steps[step].selection);
            stepDef.attachTo = {
              element: steps[step].selection,
              on: steps[step].position // 'auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'
            };
          }
          tour.addStep(stepDef);
        }
        */
        /*
        tour.addStep({
          id: 'example-step',
          text: 'Welcome to the OpenDAP Example!  Here you\'ll see the power of OpenDAP.',
          classes: 'example-step-extra-class',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });
  
        tour.addStep({
          id: 'example-step-1',
          text: 'Click on the home button to see Home.',
          attachTo: {
            element: '.memo\\(NavBar\\)\\-menuButtonText\\-8',
            on: 'bottom'
          },
          classes: 'example-step-extra-class',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });
  
        tour.addStep({
          id: 'example-step-1',
          text: 'Click on the login button to Login, duh!!',
          attachTo: {
            element: '[href=\'\/blog\'] > .MuiButtonBase-root > .MuiButton-label',
            on: 'bottom'
          },
          classes: 'example-step-extra-class',
          buttons: [
            {
              text: 'Next',
              action: tour.next
            }
          ]
        });
  
        tour.addStep({
          id: 'example-step',
          text: 'Thank you for checkout out this tour!',
          classes: 'example-step-extra-class',
          buttons: [
            {
              text: 'Finish Tour',
              action: () => setShowAppBar(true)
            }
          ]
        });
        */
       
        // tour.start();
      };

      steps.forEach(() => {
        const index = guideList.length;
        guideList.push(<Button
          variant="contained"
          color="default"
          className={classes.button}
          onClick={() => {
            console.log('Step onClick');
            setCurrentIndex(index);
            setShowAttach(true);
          }
          }
        >Step {guideList.length + 1}</Button>);
        });      

      if (guideList.length > 0) {
        guideList.unshift(<IconButton color="inherit" aria-label="open drawer" onClick={() => playGuide()}><PlayArrowIcon /></IconButton>);
      }

      return (<div>
        <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <GlobalEditor open={showGlobal} setOpen={setShowGlobal} createStep={(step: Step) => theSteps.createStep(step)}/>
          <SelectionEditor open={showAttach} setOpen={setShowAttach} steps={theSteps} cancel={() => setCurrentIndex(-1)}/>

          <AppBar position="fixed" color="primary" className={showAppBar ? classes.appBar : classes.appBarHidden }>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={() => setShowGlobal(true)}
            >
              Global
            </Button>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={() => setShowAttach(true)}
            >
              Attach
            </Button>
            { guideList }
            <div className={classes.grow} />
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton edge="end" color="inherit" onClick={() => setOnTop(!onTop)}>
              {onTop ? (<ArrowDownwardIcon />) : (<ArrowUpwardIcon />)}
            </IconButton>
           </Toolbar>
          </AppBar>
        </ThemeProvider>
        </StylesProvider>
        Hello World!</div>);
    };

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('odapRoot')
    );

  }


}

export default Editor;
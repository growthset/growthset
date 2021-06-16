// NOTE: All of this should be loaded within a context vs. at the root

import * as React from 'react'
import styles from './styles.module.css'
import Shepherd from 'shepherd.js';
// import getCssSelector from 'css-selector-generator';
import Editor from './editor';

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

const win = window as any;

if (!win.odap) {
  const odap = {
    init: function() {
      console.log('init called!');
      this.initShepherdCss();
      if (!Editor.shouldLaunchEditor()) {
        this.startShepherd();
      } else {
        Editor.launchEditor();
      }

      /*
      let oldElem: any = null;
      // track every click - 'click' 
      document.body.addEventListener('click', function (event) {
        // console.log('mouseover occurred on element ', event.target);
        // get reference to the element user clicked on
        const element: any = event.target;
        // get unique CSS selector for that element
        if (oldElem !== null && element !== oldElem) {
          oldElem?.classList?.remove('odap_selectionOutline');
        }
        element?.classList?.add('odap_selectionOutline');

        oldElem = element;
        const selector = getCssSelector(element as any);
        // do whatever you need to do with that selector
        console.log('selector', selector);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        // capturing really locks things down
      }, {capture: true});

      document.body.addEventListener('mouseover', function (event) {
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
      });
      document.body.addEventListener('mouseout', function (event) {
        // console.log('mouseout occurred on element ', event.target);
        // get reference to the element user clicked on
        const element: any = event.target;
        element?.classList?.remove('odap_selectionOutline');
      });
      */
    },
    initShepherdCss: function() {
      var link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', 'shepherd.css');
      document.getElementsByTagName('head')[0].appendChild(link);
    },
    startShepherd: function() {
      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          classes: 'shadow-md bg-purple-dark',
          scrollTo: true
        },
        useModalOverlay: true
      });

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
            action: tour.next
          }
        ]
      });
      tour.start();
    }
  };

console.log('registering odap on window object 222!');


const win = window as any;
win.odap = odap;

// note, by this time we'll need to know the tenant ID - this may be passed in through the URL, or some other mechanism.  Will
// need to continue investigation
odap.init();

}

export const opendap = win.odap;

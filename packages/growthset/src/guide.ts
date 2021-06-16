import Shepherd from 'shepherd.js';

export interface Step {
  type: string;
  content: string;
  selection: string | null;
  position: string | null;
}

export class Steps {
  
  steps: Step[];
  setSteps: Function;
  currentIndex: number;
  setCurrentIndex: Function;

  constructor(theSteps: Step[], theSetSteps: Function, theCurrentIndex: number, theSetCurrentIndex: Function) {
    this.steps = theSteps;
    this.setSteps = theSetSteps;
    this.currentIndex = theCurrentIndex;
    this.setCurrentIndex = theSetCurrentIndex;
  }

  createStep(step: Step) {
    this.setSteps([...this.steps, step]);
  }

  editCurrentStep(step: Step) {
    this.steps[this.currentIndex] = step;
    this.setSteps(this.steps);
    this.setCurrentIndex(-1);
  }

  removeCurrentStep() {
    console.log("removing index: " + this.currentIndex + ' steps length: ' + this.steps.length);
    this.steps.splice(this.currentIndex, 1);
    console.log("new steps length: " + this.steps.length);
    this.setSteps(this.steps);
    this.setCurrentIndex(-1);
  }

  hasCurrentStep() {
      return this.currentIndex != -1;
  }

  getCurrentStep(): Step | null {
      if (this.hasCurrentStep()) {
        return this.steps[this.currentIndex];
      } else {
        return null;
      }
  }

}

export function playGuide(steps: Step[], callback: Function) {
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
              action: (step != steps.length - 1) ? tour.next : () => { tour.next(); callback() /*setShowAppBar(true)*/ },
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
      tour.start();

}
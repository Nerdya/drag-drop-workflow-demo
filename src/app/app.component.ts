import { Component, OnInit } from '@angular/core';
import {
  Definition,
  Designer,
  GlobalEditorContext,
  Properties,
  Uid,
  Step,
  StepEditorContext,
  StepsConfiguration,
  ToolboxConfiguration,
  ValidatorConfiguration,
  BranchedStep
} from 'sequential-workflow-designer';

function createStep(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'task',
    name: 'Step',
    properties: {
      velocity: 0
    }
  };
}

function createContainer(): Step {
  return {
    componentType: 'container',
    id: Uid.next(),
    type: 'foreach',
    name: 'Foreach of users',
    properties: {
      itemsSource: 'select * from users'
    }
  };
}

function createSwitch(): BranchedStep {
  return {
    componentType: 'switch',
    id: Uid.next(),
    type: 'if',
    name: 'Switch',
    properties: {
      variable: 'a',
      expression: 'if (a > 10) return branchA; return branchB; return branchC;'
    },
    branches: {
      'branchA': [
        createScreen(),
      ],
      'branchB': [
        createAPI(),
      ],
      'branchC': [
        createLogicRule(),
      ]
    }
  };
}

function createScreen(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'task',
    name: 'Screen name',
    properties: {
      velocity: 0
    }
  };
}

function createAPI(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'task',
    name: 'API name',
    properties: {
      velocity: 0
    }
  };
}

function createLogicRule(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'task',
    name: 'Logic Rule name',
    properties: {
      velocity: 0
    }
  };
}

function createDefinition(): Definition {
  return {
    properties: {
      velocity: 0
    },
    sequence: [
      createScreen()
    ]
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'drag-drop-workflow-demo';
  private designer?: Designer;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;
  public selectedStepId: string | null = null;
  public isReadonly = false;
  public isToolboxCollapsed = false;
  public isEditorCollapsed = false;
  public isValid?: boolean;

  public readonly toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      {
        name: 'Logic',
        steps: [
          // createContainer(),
          createSwitch(),
        ]
      },
      {
        name: 'Select Screen',
        steps: [
          createScreen(),
          createScreen(),
        ]
      },
      {
        name: 'Select API',
        steps: [
          createAPI(),
          createAPI(),
        ]
      },
      {
        name: 'Select Logic Rule',
        steps: [
          createLogicRule(),
          createLogicRule(),
        ]
      }
    ]
  };
  public readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: () => './assets/angular-icon.svg'
  };
  public readonly validatorConfiguration: ValidatorConfiguration = {
    step: (step: Step) => !!step.name && Number(step.properties['velocity']) >= 0,
    root: (definition: Definition) => Number(definition.properties['velocity']) >= 0
  };

  public ngOnInit() {
    this.updateDefinitionJSON();
  }

  public onDesignerReady(designer: Designer) {
    this.designer = designer;
    this.updateIsValid();
    console.log('designer ready', this.designer);
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateIsValid();
    this.updateDefinitionJSON();
    console.log('definition has changed');
  }

  public onSelectedStepIdChanged(stepId: string | null) {
    this.selectedStepId = stepId;
  }

  public onIsToolboxCollapsedChanged(isCollapsed: boolean) {
    this.isToolboxCollapsed = isCollapsed;
  }

  public onIsEditorCollapsedChanged(isCollapsed: boolean) {
    this.isEditorCollapsed = isCollapsed;
  }

  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(properties: Properties, name: string, event: Event, context: GlobalEditorContext | StepEditorContext) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  public reloadDefinitionClicked() {
    this.definition = createDefinition();
    this.updateDefinitionJSON();
  }

  public toggleReadonlyClicked() {
    this.isReadonly = !this.isReadonly;
  }

  public toggleSelectedStepClicked() {
    if (this.selectedStepId) {
      this.selectedStepId = null;
    } else if (this.definition.sequence.length > 0) {
      this.selectedStepId = this.definition.sequence[0].id;
    }
  }

  public toggleToolboxClicked() {
    this.isToolboxCollapsed = !this.isToolboxCollapsed;
  }

  public toggleEditorClicked() {
    this.isEditorCollapsed = !this.isEditorCollapsed;
  }

  private updateDefinitionJSON() {
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
  }

  private updateIsValid() {
    this.isValid = this.designer?.isValid();
  }
}

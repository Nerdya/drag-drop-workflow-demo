import {Component, OnInit} from '@angular/core';
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
  BranchedStep,
  SequentialStep,
} from 'sequential-workflow-designer';
import {response} from "./response";

function createTask(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'task',
    name: 'Task',
    properties: {
      value: 0
    }
  };
}

function createContainer(): SequentialStep {
  return {
    componentType: 'container',
    id: Uid.next(),
    type: 'empty',
    name: 'Container',
    properties: {
      value: 0,
    },
    sequence: [
    ]
  };
}

function createIf(): BranchedStep {
  return {
    componentType: 'switch',
    id: Uid.next(),
    type: 'if',
    name: 'If-else',
    properties: {
      value: 0,
    },
    branches: {
      'true': [
      ],
      'false': [
      ],
    }
  };
}

function createSwitch(): BranchedStep {
  return {
    componentType: 'switch',
    id: Uid.next(),
    type: 'parallel',
    name: 'Switch',
    properties: {
      value: 0,
    },
    branches: {
      'Option A': [
      ],
      'Option B': [
      ],
      'Option C': [
      ]
    }
  };
}

function createScreen(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'text',
    name: 'Screen name',
    properties: {
      value: 0
    }
  };
}

function createAPI(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'text',
    name: 'API name',
    properties: {
      value: 0
    }
  };
}

function createLogicRule(): Step {
  return {
    componentType: 'task',
    id: Uid.next(),
    type: 'text',
    name: 'Logic Rule name',
    properties: {
      value: 0
    }
  };
}

function createDefinition(): Definition {
  return {
    properties: {
      value: 0
    },
    sequence: [
      createTask()
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
  definition: Definition = createDefinition();
  stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: (componentType: string, type: string) => {
      switch (componentType) {
        case 'container': {
          switch (type) {
            case 'loop':
              return `./assets/icon-loop.svg`;
            default:
              return null;
          }
        }
        case 'switch': {
          switch (type) {
            case 'if':
              return `./assets/icon-if.svg`;
            case 'parallel':
              return `./assets/icon-if.svg`;
            default:
              return null;
          }
        }
        case 'task': {
          switch (type) {
            case 'text':
              return `./assets/icon-text.svg`;
            case 'task':
              return `./assets/icon-task.svg`;
            case 'save':
              return `./assets/icon-save.svg`;
            default:
              return null;
          }
        }
      }
      return null;
    }
  };
  validatorConfiguration: ValidatorConfiguration = {
    step: (step: Step) => !!step.name && Number(step.properties['value']) >= 0,
    root: (definition: Definition) => Number(definition.properties['value']) >= 0
  };
  toolboxConfiguration!: ToolboxConfiguration;

  definitionJSON?: string;
  selectedStepId: string | null = null;
  isReadonly = false;
  isToolboxCollapsed = false;
  isEditorCollapsed = false;
  isValid?: boolean;

  ngOnInit() {
    this.initToolboxConfig();
    this.updateDefinitionJSON();
  }

  initToolboxConfig() {
    this.toolboxConfiguration = {
      groups: [
        {
          name: 'Components',
          steps: [
            createContainer(),
            createIf(),
            createSwitch(),
            createTask(),
          ]
        },
        {
          name: 'Select Screen',
          steps: [
            createScreen(),
          ]
        },
        {
          name: 'Select API',
          steps: [
            createAPI(),
          ]
        },
        {
          name: 'Select Logic Rule',
          steps: [
            createLogicRule(),
          ]
        }
      ]
    };
  }

  onDesignerReady(designer: Designer) {
    this.designer = designer;
    this.updateIsValid();
    // console.log('designer ready', this.designer);
  }

  onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateIsValid();
    this.updateDefinitionJSON();
    // console.log('definition has changed');
  }

  onSelectedStepIdChanged(stepId: string | null) {
    this.selectedStepId = stepId;
  }

  onIsToolboxCollapsedChanged(isCollapsed: boolean) {
    this.isToolboxCollapsed = isCollapsed;
  }

  onIsEditorCollapsedChanged(isCollapsed: boolean) {
    this.isEditorCollapsed = isCollapsed;
  }

  updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  updateProperty(properties: Properties, name: string, event: Event, context: GlobalEditorContext | StepEditorContext) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  saveDefinitionClicked() {
    const res = {
    }
    localStorage.setItem('response', JSON.stringify(res));
  }

  loadDefinitionClicked() {
    const lastDefinition = localStorage.getItem('response') ?? '';
    this.definition = lastDefinition ? JSON.parse(lastDefinition) : createDefinition();
    this.updateDefinitionJSON();
  }

  toggleReadonlyClicked() {
    this.isReadonly = !this.isReadonly;
  }

  toggleSelectedStepClicked() {
    if (this.selectedStepId) {
      this.selectedStepId = null;
    } else if (this.definition.sequence.length > 0) {
      this.selectedStepId = this.definition.sequence[0].id;
    }
  }

  // toggleToolboxClicked() {
  //   this.isToolboxCollapsed = !this.isToolboxCollapsed;
  // }
  //
  // toggleEditorClicked() {
  //   this.isEditorCollapsed = !this.isEditorCollapsed;
  // }

  private updateDefinitionJSON() {
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
  }

  private updateIsValid() {
    this.isValid = this.designer?.isValid();
  }
}

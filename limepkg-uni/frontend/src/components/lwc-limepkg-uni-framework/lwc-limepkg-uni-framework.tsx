import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,

} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import  { Option } from '@limetech/lime-elements';
import { UniComponents } from '../lwc-limepkg-uni-uni-components/lwc-limepkg-uni-uni-components';

@Component({
    tag: 'lwc-limepkg-uni-framework',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-framework.css',
})

export class Framework implements LimeWebComponent {
    @Prop()
    public platform: LimeWebComponentPlatform;

    @Prop()
    public context: LimeWebComponentContext;

    @Element()
    public element: HTMLElement;

    @State()
     private dateValue = new Date();

    @State()
    public selectValue: Option;

    @State()
    private options: Option[] = [
        { text: 'Deal', value: 'deal' },
        { text: 'Solution Improvement', value: 'solutionimprovement'}
    ]

    constructor() {
        this.handleChange = this.handleChange.bind(this);

        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return [
            <limel-grid>
                <grid-header>
                    <limel-icon badge={true} name="megaphone" size="medium"/>
                    <h1>Sprint planner</h1>
                    <div id="filter">
                         <limel-select
                          label="Limetype"
                          value={this.selectValue}
                          options={this.options}
                          onChange={this.onChange}
                          // multiple={true}
                         />
                       
                    </div>
                    <div id="week-display">
                    <p>
                    <limel-date-picker
                        type="week"
                        label="week"
                        value={this.dateValue}
                        onChange={this.handleChange}
                    />
                    
                </p>
 
                </div>
                </grid-header>            
                <grid-main>
                    <div id="urgent">
                    </div>
                    <lwc-limepkg-uni-uni-components platform={this.platform} context = {this.context} />
                </grid-main>

            </limel-grid>    
        ];
    }
    private handleChange(event) {
        this.dateValue = event.detail;
    }

    private onChange(event) {
        this.selectValue = event.detail;
    }
}

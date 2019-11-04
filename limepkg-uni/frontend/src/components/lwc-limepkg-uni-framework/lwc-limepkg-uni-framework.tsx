import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,

} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import  { Option } from '@limetech/lime-elements';

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
                        <p>Value: {JSON.stringify(this.selectValue)}</p>
                    </div>
                    <div id="week-display">
                    <p>
                    <limel-date-picker
                        type="week"
                        label="week"
                        value={this.dateValue}
                        onChange={this.handleChange}
                    />
                    <p style={{ 'font-size': 'small' }}>
                        Value:{' '}
                        <code>
                            {this.dateValue
                                ? this.dateValue.toString()
                                : JSON.stringify(this.dateValue)}
                        </code>
                    </p>
                </p>
 
                </div>
                </grid-header>
                <urgent-component>
                    <p>AKUT AKUT !!!</p>
                </urgent-component>
                <grid-main>
                    <flex-section> 
                        <h3>state</h3>
                        <card-component>
                            <div class="card">
                                <h3 class="title"> Title </h3>
                                <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                                <p class="values"> bla bla bla </p>
                            </div>
                        </card-component>
                        </flex-section>   
                        <flex-section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </flex-section>
                    <flex-section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </flex-section>
                    <flex-section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </flex-section>
                    <flex-section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla </p>
                        </div>
                    </flex-section>
                    <flex-section>
                        <h3>state</h3>
                        <div class="card">
                            <h3 class="title"> Title </h3>
                            <p class="description"> Detta är en exempelbeskrivning som skulle kunna va på ett card. </p>
                            <p class="information"> bla bla bla</p>
                        </div>
                    </flex-section>
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

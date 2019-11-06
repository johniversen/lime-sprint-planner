import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    HttpService,
    PlatformServiceName,

} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { Option } from '@limetech/lime-elements';
import { ListItem } from '@limetech/lime-elements';

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
        { text: 'Solution Improvement', value: 'solutionimprovement' }
    ]
    @State()
    private mainData: [{
        title: string,
        secondaryText: string,
        priorityValue: number,
        id: number
    }];

    @State()
    private dialogIsOpen = false;
    private dialogData: {};

    private http: HttpService;



    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        console.log("componentWillLoad");
        //this.getDataFromEndPoint("solutionimprovement")

    }
    private getDataFromEndPoint(limeType) {
        this.http.get(`https://localhost/lime/limepkg-uni/test/?limetype=` + limeType).then(res => {
            this.updateData(res);
        });
    }


    private updateData = (res) => {
        let id = 0;
        this.mainData = res.objects.map(el => {
            console.log(this.mainData);
            return this.mainData = { ...el, id: id++ };
        });
    }

    /*     private getDeals() {
            this.listContainer = [];
            this.getDataFromEndPoint("deal");
        } */

    private openDialog(event: CustomEvent<ListItem>) {
        this.dialogIsOpen = true;
        let item = this.mainData.find(obj => obj.id === event.detail.value);
        this.dialogData = item;
        console.log(event);
    }

    private closeDialog() {
        console.log("Close dialog");
        this.dialogIsOpen = false;
        //this.dialog = null;
        // console.log(this.dialog);
    }


    public render() {
        console.log("framework Render()");
        let cardData = null;
        if (this.mainData != null) {
            cardData = <lwc-limepkg-uni-uni-components
                platform={this.platform}
                context={this.context}
                mainData={this.mainData}
                onListItemClick={this.openDialog}
            />
        }
        let dialogOutput = [];

        if (this.dialogIsOpen) {
            const entries = Object.entries(this.dialogData);

            for (const [key, count] of entries) {
                //temp +=  `${key} : ${count} `;
                dialogOutput.push(`${key} : ${count} `);
            }

        }

        return [
            <limel-grid>
                <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
                    {dialogOutput}
                    <limel-flex-container justify="end" slot="button">
                        <limel-button label="Ok" onClick={this.closeDialog} />
                    </limel-flex-container>
                </limel-dialog>
                <grid-header>
                    <limel-icon badge={true} name="megaphone" size="medium" />
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
                <urgent-component>

                </urgent-component>
                <grid-main>
                    {cardData}

                </grid-main>

            </limel-grid>
        ];
    }
    private handleChange(event) {
        this.dateValue = event.detail;
    }

    private onChange(event) {
        this.selectValue = event.detail;
        let limeType = this.selectValue.value;
        //limeType = limeType.toLowerCase();
        this.getDataFromEndPoint(limeType);
    }
}

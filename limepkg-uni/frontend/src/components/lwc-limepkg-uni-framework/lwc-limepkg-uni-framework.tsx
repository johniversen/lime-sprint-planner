import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    HttpService,
    PlatformServiceName,

} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { Option, /*DialogHeading */ } from '@limetech/lime-elements';

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
    private options: Option[] = []

    @State()
    private mainData: [{
        title: string,
        secondaryText: string,
        priorityValue: number,
        status: string,
        id: number
    }];

    @State()
    private dialogIsOpen = false;

    private dialogData: { title: string };

    private http: HttpService;

    private dialog = null;

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
        this.getLimeTypes();
    }

    private getLimeTypes() {
        this.http.get(`https://localhost/lime/limepkg-uni/test/getlimetypes`).then(res => {
            this.updateOptions(res);
        });
    }

    private getDataFromEndPoint(limeType) {
        this.http.get(`https://localhost/lime/limepkg-uni/test/?limetype=` + limeType).then(res => {
            this.updateData(res);
        });
    }

    private updateOptions(res) {
        for (let [key, value] of Object.entries(res['limetypes'])) {
            let el = { text: value as string, value: key }
            this.options.push(el);
        }
    }
    private updateData = (res) => {
        let id = 0;
        this.mainData = res.objects.map(el => {
            console.log(this.mainData);
            return this.mainData = { ...el, id: id++ };
        });
    }

    private openDialog(event: CustomEvent) {
        this.dialogIsOpen = true;
        let item = this.mainData.find(obj => obj.id === event.detail.value);

        console.log("item");
        console.log(item);
        this.dialogData = Object.assign({}, item);

        let dialogOutput = [];
        dialogOutput.push(<h1>{this.dialogData.title}</h1>);
        delete this.dialogData.title;

        const entries = Object.entries(this.dialogData);
        for (const [key, count] of entries) {
            dialogOutput.push(<p><strong>{key}</strong>: {count}<hr></hr></p>);
        }
        this.dialog = <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
            <div>{dialogOutput}</div>
            <limel-flex-container justify="end" slot="button">
                <limel-button label="Ok" onClick={this.closeDialog} />
            </limel-flex-container>
        </limel-dialog>
        console.log(this.mainData);
    }

    private closeDialog() {
        console.log("Close dialog");
        this.dialogIsOpen = false;
        this.dialog = null;
    }

    public render() {
        console.log("framework Render()");
        let cardData = null;
        if (this.mainData != null) {
            cardData =
                    <lwc-limepkg-uni-uni-components
                        platform={this.platform}
                        context={this.context}
                        mainData={this.mainData}
                        onListItemClick={this.openDialog}
                    />
                
        }

        return [
            <limel-grid>
                {this.dialog}
                <grid-header>
                    <div id="heading-icon">
                        <limel-icon class="citrus-icon" name="heart_with_arrow" size="large" />
                        <h1>Sprint planner</h1>
                    </div>
                    <div id="filter">
                        <limel-select
                            label="Limetype"
                            value={this.selectValue}
                            options={this.options}
                            onChange={this.onChange}
                        />
                    </div>
                    <div id="week-display">
                        <p>
                            <limel-date-picker
                                type="week"
                                label="week"
                                value={this.dateValue}
                                onChange={this.handleChange}
                                style={{ 'background-color': 'whitesmoke;' }}
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
        let limeType = event.detail.value;
        console.log(event);
        //limeType = limeType.toLowerCase();
        this.getDataFromEndPoint(limeType);
    }
}

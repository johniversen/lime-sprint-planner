import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    HttpService,
    PlatformServiceName,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { Option, ListItem } from '@limetech/lime-elements';

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
    private options: Option[] = []

    @State()
    private mainData: [{
        title: string,
        secondaryText: string,
        priorityValue: number,
        status: string,
        postId: number
    }];


    @State()
    private dialogIsOpen = false;

    private dialogData: { title: string, priorityValue: number, postId: number};

    private http: HttpService;

    private dialog = null;
    
    public selectValue: Option;

    private fetchingDataComplete = false;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        //console.log("componentWillLoad");
        //this.getDataFromEndPoint("solutionimprovement")
        this.getLimeTypes();
    }

    private getLimeTypes() {
        this.http.get(`https://localhost/lime/limepkg-uni/test/getlimetypes`).then(res => {
            this.updateOptions(res);
        });
    }

    private getDataFromEndPoint(limeType) {
        this.fetchingDataComplete = false;
        //console.log("getDataFromEndpoint() with limeType: " + limeType);

        this.http.get(`https://localhost/lime/limepkg-uni/test/?limetype=` + limeType).then(res => {

        //Detta funkar inte! Varför körs inte Rende(), trots state updateras?
            if (res.objects[0] == null) {
                //console.log("res = undefined");
                this.fetchingDataComplete = false;
                this.mainData = null;
                //console.log(this.mainData);
            }
            else {
                //console.log("Kommer vi hit?");
                this.fetchingDataComplete = true;
                this.updateData(res);
            }
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
            return this.mainData = { ...el, postId: id++ };
        });
    }

    private openDialog(event: CustomEvent) {
        this.dialogIsOpen = true;
        let item = this.mainData.find(obj => obj.postId === event.detail.value);

        this.dialogData = Object.assign({}, item);

        let dialogOutput: Array<ListItem<any>> = [];
       // dialogOutput.push(<h1>{this.dialogData.title}</h1>);
       let title = <h1>{this.dialogData.title}</h1>;
        delete this.dialogData.title;
        delete this.dialogData.priorityValue;
        delete this.dialogData.postId;

        const entries = Object.entries(this.dialogData);
        
        for (const [key, value] of entries) {
            let item = {} 
                if (value == "") {
                    item = {
                        text: key,
                        secondaryText: "Not assigned"
                 }
                } else  {
                    item = {
                        text: key,
                        secondaryText: value
                 };
            }

            dialogOutput.push((item as ListItem)); 
        }

        this.dialog = <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
            <div>
                {title}
                <limel-list items={dialogOutput}>
                </limel-list>
            </div>
            <limel-flex-container justify="end" slot="button">
                <limel-button label="Ok" onClick={this.closeDialog} />
            </limel-flex-container>
        </limel-dialog>
        //console.log(this.mainData);
    }

    private closeDialog() {
        //console.log("Close dialog");
        this.dialogIsOpen = false;
        this.dialog = null;
    }

    public render() {
        //console.log("framework Render()");
        //console.log(this.mainData);

        //Måste ha nån flagga som kollar om hämtning av data är klar. Render() körs "för tidigt".
        let cardData = <h1>There are no data posts in the database</h1>;
        if (this.fetchingDataComplete) {
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
                <div id="urgent">
                    
                </div>
                <grid-main>
                    {cardData}
                </grid-main>

            </limel-grid>
        ];
    }
    private handleChange(event) {
        this.dateValue = event.detail;
    }

    //Varför körs denna två gånger?
    private onChange(event) {
        //console.log("OnChange()");
        this.selectValue = event.detail;
        let limeType = event.detail.value;
        this.getDataFromEndPoint(limeType);
    }
}

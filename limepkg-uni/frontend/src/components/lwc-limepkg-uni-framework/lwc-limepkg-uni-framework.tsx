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

    private putOptions: Option[] = [
        // Detta ska vara alla statusar för den Limetypen vi visar
        //{ text: 'Luke Skywalker', value: 'luke' },
        //{ text: 'Han Solo', value: 'han' },
        //{ text: 'Leia Organo', value: 'leia' },
    ];

    @State()
    private options: Option[] = []

    @State()
    private mainData: [{
        title: string,
        secondaryText: string,
        priorityValue: number,
        status: string,
        postId: number,
        priority: string
    }];

    @State()
    private dialogIsOpen = false;

    private dialogData: { title: string, priorityValue: number, postId: number, priority: string };

    private http: HttpService;

    private dialog = null;

    public selectValue: Option;

    public putValue: Option;

    private fetchingDataComplete = false;

    public limetypeData = [];

    private currentPostId = null;

    constructor() {
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.putOnChange = this.putOnChange.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        //console.log("componentWillLoad");
        //this.getDataFromEndPoint("solutionimprovement")
        this.getLimeTypes();
    }

    private getLimeTypes() {
        this.http.get(`https://localhost/lime/limepkg-uni/test/getlimetypes`).then(res => {
            this.saveLimeTypeData(res);
            this.updateOptions(res);
        });
    }

    private saveLimeTypeData(res) {
        this.limetypeData = {...res.limetypes}
        console.log(this.limetypeData);
    }

    private getDataFromEndPoint(limeType) {
        this.fetchingDataComplete = false;

        this.http.get(`https://localhost/lime/limepkg-uni/test/?limetype=` + limeType).then(res => {

            if (res.objects[0] == null) {
                this.fetchingDataComplete = false;
                this.mainData = null;
            }
            else {
                this.fetchingDataComplete = true;
                this.updateData(res);
            }
        });
    }

    private sendPutRequest() {
        console.log("Send request");
        const limetypeStatus = this.limetypeData[this.selectValue.value].status;
        console.log(typeof(limetypeStatus));
        console.log(limetypeStatus);
        let postId = this.currentPostId;
        let data = {
            [limetypeStatus]: {
                key: this.putValue.value
            }
        }
        this.http.put(`https://localhost/lime/api/v1/limeobject/` + `${this.selectValue.value}` + `/` + `${postId}` + `/`,data).then(res => {
            console.log(res);
        })
    }

    private updateOptions(res) {
        for (let [key, val] of Object.entries(res['limetypes'])) {
            let el = { text: val['displayName'] as string, value: key as string }
            this.options.push(el)
        }
    }

    private updateData = (res) => {
        this.mainData = res.objects.map(el => {
            return this.mainData = { ...el };
        });
        console.log(this.mainData);
    }

    private updatePutOptions() {
        this.putOptions = [];
        Object.keys(this.limetypeData[this.selectValue.value]['prio']).forEach((key, index) => {
            let item = {
                text: key,
                value: key
            }
            this.putOptions.push(item);
        })
    }

    private openDialog(event: CustomEvent) {
        this.updatePutOptions();
        this.dialogIsOpen = true;
        let item = this.mainData.find(obj => obj.postId === event.detail.value);
        this.currentPostId = item.postId;
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
            } else {
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
                <limel-select
                    // Vi vill ändra label så att den är status kortet/dialogen har just nu
                    label="Update status"
                    value={this.putValue}
                    options={this.putOptions}
                    onChange={this.putOnChange}
                />
            </div>
            <limel-flex-container justify="end" slot="button">
                <limel-button label="Close" onClick={this.closeDialog} />
            </limel-flex-container>
        </limel-dialog>
        //console.log(this.mainData);

    }

    private closeDialog() {
        //console.log("Close dialog");
        
        this.dialogIsOpen = false;
        this.dialog = null;
        this.currentPostId = null;
    }

    public render() {
        console.log("framework Render()");
        console.log(this.mainData);

        let cardData = <h1>There are no data posts in the database</h1>;
        if (this.fetchingDataComplete) {
            let limeTypeMetaData = null;
            Object.keys(this.limetypeData).forEach( (key, index) => {
                if (key === this.selectValue.value) {
                    limeTypeMetaData = this.limetypeData[this.selectValue.value];
                }
            })

            cardData =
                <lwc-limepkg-uni-uni-components
                    platform={this.platform}
                    context={this.context}
                    mainData={this.mainData}
                    limeTypeMetaData={limeTypeMetaData}
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
        console.log(this.dateValue);
   }

    //Varför körs denna två gånger?
    private onChange(event) {
        console.log("OnChange()");
        this.selectValue = event.detail;
        let limeType = event.detail.value;
        this.getDataFromEndPoint(limeType);
    }

    private putOnChange(event) {
        // I denna vill vi skicka vårt PUT-request
        console.log("OnChange() för put");
        this.putValue = event.detail;
        console.log(this.putValue);
        this.sendPutRequest();
    }
}

import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    HttpService,
    PlatformServiceName,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State, Listen } from '@stencil/core';
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

    private statusOptions: Option[] = [];

    @State()
    private limetypeOptions: Option[] = []

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

    @State()
    public selectedStatus: Option;

    private dialogData: { title: string, priorityValue: number, postId: number, priority: string };

    private http: HttpService;

    private dialog = null;

    public selectedLimetype: Option;

    private fetchingDataComplete = false;

    public limetypeMetaData = [];

    private currentPostId = null;

    constructor() {
        this.handleDateChange = this.handleDateChange.bind(this);
        this.limetypeOnChange = this.limetypeOnChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.statusOnChange = this.statusOnChange.bind(this);
        this.updateCurrentCardStatus = this.updateCurrentCardStatus.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        this.getLimeTypes();
    }

    private getLimeTypes() {
        this.http.get(`https://localhost/lime/limepkg-uni/test/getlimetypes`).then(res => {
            this.saveLimeTypeData(res);
            this.updateLimetypeOptions(res);
        });
    }

    private saveLimeTypeData(res) {
        this.limetypeMetaData = { ...res.limetypes }
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
                this.updateMainData(res);
            }
        });
    }

    private sendPutRequest() {
        const limetypeStatus = this.limetypeMetaData[this.selectedLimetype.value].status;
        let postId = this.currentPostId;
        let data = {
            [limetypeStatus]: {
                key: this.selectedStatus.value
            }
        }
        this.http.put(`https://localhost/lime/api/v1/limeobject/` + `${this.selectedLimetype.value}` + `/` + `${postId}` + `/`, data).then(res => {
            console.log("PUT REQUEST SENT");
        })
    }

    private updateLimetypeOptions(res) {
        for (let [key, val] of Object.entries(res['limetypes'])) {
            let el = { text: val['displayName'] as string, value: key as string }
            this.limetypeOptions.push(el)
        }
    }

    private updateMainData = (res) => {
        this.mainData = res.objects.map(el => {
            return this.mainData = { ...el };
        });
    }

    private updateCurrentCardStatus() {
        this.mainData.map(obj => {
            if (obj.postId === this.currentPostId) {
                return obj = { ...obj, status: this.selectedStatus.value };
            }
        })
    }

    private updateStatusOptions() {
        this.statusOptions = [];
        Object.keys(this.limetypeMetaData[this.selectedLimetype.value]['prio']).forEach((key) => {
            let item = {
                text: key,
                value: key
            }
            this.statusOptions.push(item);
        })
    }

    @Listen('cardClicked')
    private openDialog(event) {
        this.updateStatusOptions();
        this.dialogIsOpen = true;
        let item = this.mainData.find(obj => obj.postId === event.detail.value);
        this.currentPostId = item.postId;
        this.dialogData = Object.assign({}, item);
        this.selectedStatus = { text: item.status, value: item.status };

        let dialogOutput: Array<ListItem<any>> = [];
        let title = <h1>{this.dialogData.title}</h1>;
        delete this.dialogData.title;
        delete this.dialogData.priorityValue;
        delete this.dialogData.postId;

        const entries = Object.entries(this.dialogData);

        for (let [key, value] of entries) {
            let item = {}
            if (value == "") {
                item = {
                    text: key[0].toUpperCase() + key.slice(1),
                    secondaryText: "Not assigned"
                }
            } else {
                item = {
                    text: key[0].toUpperCase() + key.slice(1),
                    secondaryText: (typeof(value) === 'string' ? value[0].toUpperCase() + value.slice(1): value)
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
                    label={"Limetype status"}
                    value={this.selectedStatus}
                    options={this.statusOptions}
                    onChange={this.statusOnChange}
                />
            </div>
            <limel-flex-container justify="end" slot="button">
                <limel-button label="Close" onClick={this.closeDialog} />
            </limel-flex-container>
        </limel-dialog>
    }

    private closeDialog() {
        this.dialogIsOpen = false;
        this.dialog = null;
        this.updateCurrentCardStatus();
        this.currentPostId = null;

    }
    private handleDateChange(event) {
        this.dateValue = event.detail;
    }

    //Varför körs denna två gånger?
    private limetypeOnChange(event) {
        this.selectedLimetype = event.detail;
        let limeType = event.detail.value;
        this.getDataFromEndPoint(limeType);
    }

    private statusOnChange(event) {
        // I denna vill vi skicka vårt PUT-request
        this.selectedStatus = Object.create(event.detail); // FEL? Funkar?
        this.sendPutRequest();
    }


    public render() {
        let cardData = <h1>There are no data posts in the database.</h1>;
        if (this.fetchingDataComplete) {
            let limeTypeMetaData = null;
            Object.keys(this.limetypeMetaData).forEach((key) => {
                if (key === this.selectedLimetype.value) {
                    limeTypeMetaData = this.limetypeMetaData[this.selectedLimetype.value];
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
                            value={this.selectedLimetype}
                            options={this.limetypeOptions}
                            onChange={this.limetypeOnChange}
                        />
                    </div>
                    <div id="week-display">
                        <p>
                            <limel-date-picker
                                type="week"
                                label="week"
                                value={this.dateValue}
                                onChange={this.handleDateChange}
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
}

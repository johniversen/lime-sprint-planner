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

   // private statusOptions: Option[] = [];

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

    private http: HttpService;
    private dialog = null;
    private fetchingDataComplete = false;
    private currentPostId = null;

    public limetypeMetaData = [];
    public selectedLimetype: Option;

    private firstRender = true;

    // private dialogOutput: Array<ListItem<any>> = [];

    private dialogMainData: { title: string, dialogListItems: Array<ListItem<any>>, dialogDropDownOptions: Option[] };
    //private dialogDropDownOptions: Option[];



    constructor() {
        this.handleDateChange         = this.handleDateChange.bind(this);
        this.handleDateChangeNoFilter = this.handleDateChangeNoFilter.bind(this);
        this.limetypeOnChange         = this.limetypeOnChange.bind(this);
        this.openDialog               = this.openDialog.bind(this);
        this.closeDialog              = this.closeDialog.bind(this);
        this.statusOnChange           = this.statusOnChange.bind(this);
        this.updateCurrentCardStatus  = this.updateCurrentCardStatus.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        this.getLimeTypes();
    }

    public formatDate(date) {
        let formattedDate = date.getDate()  + '-'
        formattedDate    += date.getMonth() + 1 + '-'
        formattedDate    += date.getFullYear()
        return formattedDate
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
    private  encodeQueryData(data) {
       const ret = [];
       for (let d in data)
           ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
       return ret.join('&');
    }

    private getDataFromEndPoint(limeType) {
        console.log("getDataFromEndpoint() ")
        this.fetchingDataComplete = false;
        let args = {
            'limetype': limeType
        }
        if (this.dateValue) {
            args['chosenDate'] = this.formatDate(this.dateValue)
        }
        let argsString = this.encodeQueryData(args)
        this.http.get(`https://localhost/lime/limepkg-uni/test/?` + argsString).then(res => {
            this.updateMainData(res);
            console.log("Get request successfull:")
            console.log(res)
            this.fetchingDataComplete = true;
        }, err => {
            console.log("Get request UNSUCCESSFUL:")
            console.log(err)
            this.fetchingDataComplete = true;
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
       // this.statusOptions = [];
       let statusOptions = [];
        Object.keys(this.limetypeMetaData[this.selectedLimetype.value]['prio']).forEach((key) => {
            let item = {
                text: key,
                value: key
            }
            statusOptions.push(item);
        })
        
        return statusOptions;
    }

    @Listen('cardClicked')
    private openDialog(event) {

        console.log("CardClicked")
        let statusOptions = this.updateStatusOptions();

        let item = this.mainData.find(obj => obj.postId === event.detail.value);
        this.currentPostId = item.postId;
        let dialogData = Object.assign({}, item);

        this.selectedStatus = statusOptions.find((option: any) => {
            return item.status === option.text && item.status === option.value
        })
        let dialogOutput: Array<ListItem<any>> = [];
        let title = dialogData.title;
        delete dialogData.title;
        delete dialogData.priorityValue;
        delete dialogData.postId;

        const entries = Object.entries(dialogData);

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
                    secondaryText: (typeof (value) === 'string' ? value[0].toUpperCase() + value.slice(1) : value)
                };
            }
            dialogOutput.push((item as ListItem));
        }

        this.dialogMainData = {
            title: title,
            dialogListItems: dialogOutput,
            dialogDropDownOptions: statusOptions
        };
        this.dialogIsOpen = true;

    }

    @Listen('closeDialog')
    private closeDialog() {
        this.dialogIsOpen = false;
        //this.dialog = null;
        this.updateCurrentCardStatus();
        this.currentPostId = null;
    }

    private handleDateChange(event) {
        this.dateValue = event.detail;
        this.getDataFromEndPoint(this.selectedLimetype.value)
    }

    private handleDateChangeNoFilter() {
        this.dateValue = null;
        this.getDataFromEndPoint(this.selectedLimetype.value)
    }

    //Varför körs denna två gånger?
    private limetypeOnChange(event) {
        this.selectedLimetype = event.detail;
        let limeType = event.detail.value;
        this.getDataFromEndPoint(limeType);
    }

    @Listen('statusOnChange')
    private statusOnChange(event) {

        this.selectedStatus = this.dialogMainData.dialogDropDownOptions.find((option: any) => {
            return event.detail.detail.text === option.text && event.detail.detail.value === option.value
        })
        this.sendPutRequest();
    }

    public render() {


        if (this.dialogIsOpen) {
            this.dialog = <lwc-limepkg-uni-dialog dialogMainData={this.dialogMainData} selectedStatus={this.selectedStatus} isVisable={this.dialogIsOpen}></lwc-limepkg-uni-dialog >
        } else {
            this.dialog = null;
        }

        console.log(this.dialog);

        let cardData       = null 
        let weekPicker     = null
        let noFilterButton = null
        let errorMessage   = this.mainData == null ? <h2>Select a limetype above</h2> : null
        // Felmeddelande när ingen data finns? ev. när http request failar?



        if (this.fetchingDataComplete) {
            let limeTypeMetaData = null;
            Object.keys(this.limetypeMetaData).forEach((key) => {
                if (key === this.selectedLimetype.value) {
                    limeTypeMetaData = this.limetypeMetaData[this.selectedLimetype.value];
                }
            })
            
            cardData =
                <lwc-limepkg-uni-uni-components
                    platform         = {this.platform}
                    context          = {this.context}
                    mainData         = {this.mainData}
                    limeTypeMetaData = {limeTypeMetaData}
                    onListItemClick  = {this.openDialog}
                />

            // If the limetype has a defined date_done, show weekpicker
            if (this.limetypeMetaData[this.selectedLimetype.value]['date_done']) {
                weekPicker = 
                    <limel-date-picker
                        type     = "week"
                        label    = "week"
                        value    = {this.dateValue}
                        onChange = {this.handleDateChange}
                    />
                noFilterButton = 
                    <limel-button
                        label   = "Show all"
                        primary = {true}
                        onClick = {this.handleDateChangeNoFilter}
                    />
            }
        }
        return [
            <limel-grid>
                {this.dialog}

                <grid-header>
                    <div id="heading-icon">
                        <limel-icon class="sprint-icon" name="running_rabbit" size="large" />
                        <h1>Lime Sprinter</h1>
                    </div>
                    <div id="filter">
                        <limel-select
                            label    = "Limetype"
                            value    = {this.selectedLimetype}
                            options  = {this.limetypeOptions}
                            onChange = {this.limetypeOnChange}
                        />
                    </div>
                    <div id="week-display">
                        {weekPicker}
                    </div>
                    <div id="no-filter-button">
                        {noFilterButton}
                    </div>
                </grid-header>
                <grid-main>
                    {errorMessage}
                    {cardData}
                </grid-main>
            </limel-grid>
        ];
    }
}

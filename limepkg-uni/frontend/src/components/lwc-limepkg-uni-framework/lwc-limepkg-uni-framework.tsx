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
    private limetypeOptions: Option[] = []

    @State()
    private mainData: Array<{
        priorityValue: number
        Card: {
            CardTitle: string,
            Responsible: string
        },
        AdditionalInfo: {
        }
        postId: number
    }> = [];

    @State()
    private dialogIsOpen = false;

    @State()
    public selectedStatus: Option;

    private dateValue: Date;

    private http: HttpService;
    private dialog = null;
    private fetchingDataComplete = false;

    private currentPostId: number;

    public limetypeMetaData = [];
    public selectedLimetype: Option;

    private dialogMainData: { title: string, dialogListItems: Array<ListItem<any>>, dialogDropDownOptions: Option[] };

    constructor() {
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateChangeNoFilter = this.handleDateChangeNoFilter.bind(this);
        this.limetypeOnChange = this.limetypeOnChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.statusOnChange = this.statusOnChange.bind(this);
        this.updateCurrentCardStatus = this.updateCurrentCardStatus.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
        this.statusOnDrop = this.statusOnDrop.bind(this);
        this.sendPutRequestOnDrag = this.sendPutRequestOnDrag.bind(this);
        this.updateDraggedCardStatus = this.updateDraggedCardStatus.bind(this);
        this.getPriorityNameByValue = this.getPriorityNameByValue.bind(this);
    }

    public componentWillLoad() {
        this.http = this.platform.get(PlatformServiceName.Http);
        this.getLimeTypes();
        this.dateValue = new Date();
    }

    // Called on load to fill the top drop-down with Limetypes
    private getLimeTypes() {
        this.http.get(`https://localhost/lime/limepkg-uni/getlimetypes`).then(res => {
            this.saveLimeTypeData(res);
            this.updateLimetypeOptions(res);
        });
    }

    // Called when you select a Limetype in the top drop-down
    private getDataFromEndPoint(limeType) {
        this.fetchingDataComplete = false;
        let args = {
            'limetype': limeType
        }
        if (this.limetypeMetaData[limeType]['Optional'] && this.limetypeMetaData[limeType]['Optional']['Date Deadline'] && this.dateValue !== null) {
            console.log(this.dateValue);
            args['chosenDate'] = this.formatDate(this.dateValue)
        }
        let argsString = this.encodeQueryData(args)
        this.http.get(`https://localhost/lime/limepkg-uni/?` + argsString).then(res => {
            this.updateMainData(res);
            console.log("Get request successfull:")
            this.fetchingDataComplete = true;
        }, err => {
            console.log("Get request UNSUCCESSFUL:")
            console.log(err)
            this.fetchingDataComplete = true;
        });
    }

    // Called when selecting a status in drop-down inside dialog
    private sendPutRequest() {
        const limetypeStatus = this.limetypeMetaData[this.selectedLimetype.value].PriorityVariable;
        let postId = this.currentPostId;
        let data = {
            [limetypeStatus]: {
                key: this.selectedStatus.value
            }
        }
        this.http.put(`https://localhost/lime/api/v1/limeobject/` + `${this.selectedLimetype.value}` + `/` + `${postId}` + `/`, data)
    }

    private sendPutRequestOnDrag(postId, priorityValue) {
        const limetypeStatus = this.limetypeMetaData[this.selectedLimetype.value].PriorityVariable;
        let priority = this.getPriorityNameByValue(priorityValue);
        let data = {
            [limetypeStatus]: {
                key: priority
            }
        }
        this.http.put(`https://localhost/lime/api/v1/limeobject/` + `${this.selectedLimetype.value}` + `/` + `${postId}` + `/`, data);
    }

    // Takes response from GET and saves to this.limetypeMetaData
    private saveLimeTypeData(res) {
        this.limetypeMetaData = { ...res.limetypes }
    }

    private encodeQueryData(data) {
        const ret = [];
        for (let d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    private formatDate(date) {
        let formattedDate = date.getDate() + '-'
        formattedDate += date.getMonth() + 1 + '-'
        formattedDate += date.getFullYear()
        return formattedDate
    }

    private updateLimetypeOptions(res) {
        for (let [key, val] of Object.entries(res['limetypes'])) {
            let el = { text: val['DisplayName'] as string, value: key as string }
            this.limetypeOptions.push(el)
        }
    }

    private updateMainData = (res) => {
        this.mainData = res.objects.map(el => {
            return this.mainData = { ...el };
        });
    }

    private updateCurrentCardStatus() {
        let item;
        this.mainData = this.mainData.map(obj => {
            if (obj['postId'] === this.currentPostId) {
                item = { ...obj };
                item['priorityValue'] = this.limetypeMetaData[this.selectedLimetype.value]['PriorityHierarchy'][this.selectedStatus.text];
                obj = Object.assign(item);
            }
            return obj;
        })
    }

    private updateStatusOptions() {
        let statusOptions = [];
        Object.keys(this.limetypeMetaData[this.selectedLimetype.value]['PriorityHierarchy']).forEach((key) => {
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
        let statusOptions = this.updateStatusOptions();
        let item = this.mainData.find(obj => obj.postId === event.detail.value);
        this.currentPostId = item.postId;
        let card = { ...item.Card };
        delete card.CardTitle;
        let dialogData = { ...item, Card: card };
        this.selectedStatus = statusOptions[item.priorityValue - 1];
        let dialogOutput: Array<ListItem<any>> = [];
        let title = item.Card.CardTitle;
        delete dialogData.Card.CardTitle;
        delete dialogData.priorityValue;
        delete dialogData.postId;
        const entries = Object.entries(dialogData);
        for (let [key, value] of entries) {
            for (const innerKey in value) {
                let item = {}
                if (value[innerKey] == "") {
                    item = {
                        text: innerKey[0].toUpperCase() + innerKey.slice(1),
                        secondaryText: "Not assigned"
                    }
                } else {
                    item = {
                        text: innerKey.charAt(0).toUpperCase() + innerKey.slice(1),
                        secondaryText: (typeof (value[innerKey]) === 'string' ? value[innerKey][0].toUpperCase() + value[innerKey].slice(1) : value[innerKey])
                    };
                }
                dialogOutput.push((item as ListItem));
            }
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

    private limetypeOnChange(event) {
        this.selectedLimetype = event.detail;
        let limeType = event.detail.value;
        this.getDataFromEndPoint(limeType);
    }

    @Listen('saveStatusChange')
    private saveStatus() {
        this.updateCurrentCardStatus();
        this.sendPutRequest();
        this.closeDialog();
    }

    @Listen('statusOnChange')
    private statusOnChange(event) {
        this.selectedStatus = this.dialogMainData.dialogDropDownOptions.find((option: any) => {
            return event.detail.detail.text === option.text && event.detail.detail.value === option.value
        })
    }

    @Listen('cardDropped')
    private statusOnDrop(event) {
        this.updateDraggedCardStatus(event.detail.cardID, event.detail.columnID);
        this.sendPutRequestOnDrag(event.detail.cardID, event.detail.columnID);
    }

    private updateDraggedCardStatus(postId, priorityValue) {
        let item;
        this.mainData = this.mainData.map(obj => {
            if (obj.postId === postId) {
                item = { ...obj };
                item['priorityValue'] = Number(priorityValue);
                obj = Object.assign(item);
            }
            return obj;
        })
    }

    private getPriorityNameByValue(value) {
        let priorities = this.limetypeMetaData[this.selectedLimetype.value]['PriorityHierarchy'];
        let priorityName = Object.keys(priorities).find(key => priorities[key] === Number(value));
        return priorityName;
    }

    public render() {
        if (this.dialogIsOpen) {
            this.dialog = <lwc-limepkg-uni-dialog dialogMainData={this.dialogMainData} selectedStatus={this.selectedStatus} isVisable={this.dialogIsOpen}></lwc-limepkg-uni-dialog >
        } else {
            this.dialog = null;
        }

        let cardData = null
        let weekPicker = null
        let noFilterButton = null
        let errorMessage = typeof (this.selectedLimetype) == "undefined" ? <h2>Select a limetype above!</h2> : null

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
                />


            // If the limetype has a defined date_done, show weekpicker
            if (this.limetypeMetaData[this.selectedLimetype.value]['Optional'] && this.limetypeMetaData[this.selectedLimetype.value]['Optional']['Date Deadline']) {
                weekPicker =
                    <limel-date-picker
                        type="week"
                        label="week"
                        value={this.dateValue}
                        onChange={this.handleDateChange}
                    />
                noFilterButton =
                    <limel-button
                        label="Show all"
                        primary={true}
                        onClick={this.handleDateChangeNoFilter}
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
                            label="Limetype"
                            value={this.selectedLimetype}
                            options={this.limetypeOptions}
                            onChange={this.limetypeOnChange}
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

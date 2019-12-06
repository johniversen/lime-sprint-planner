import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    NotificationService,
    PlatformServiceName,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, Event, EventEmitter } from '@stencil/core';
import { Option, ListItem, } from '@limetech/lime-elements';

@Component({
    tag: 'lwc-limepkg-uni-dialog',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-dialog.scss',
})
export class Dialog implements LimeWebComponent {
    @Prop()
    public platform: LimeWebComponentPlatform;

    @Prop()
    public context: LimeWebComponentContext;

    @Prop()
    onClose: Function

    @Element()
    public element: HTMLElement;

    @Prop()
    header: string

    @Prop()
    mainContent: [{}]

   // @Prop()
    //statusOptions: Option[] = [];

    @Prop()
    isVisable: boolean

    @Prop()
    selectedStatus: Option;

    @Prop()
    dialogMainData: { title: string, dialogListItems: Array<ListItem<any>>, dialogDropDownOptions:  Option[]};

    @Event({
        eventName: 'statusOnChange',
        composed: true,
        cancelable: true,
        bubbles: true
    }) statusOnChange: EventEmitter;

    @Event({
        eventName: 'closeDialog',
        composed: true,
        cancelable: true,
        bubbles: true
    }) closeDialog: EventEmitter;

   // @Prop()
    //dialogDropDownOptions: Option[];


    //private dialogOutput: Array<ListItem<any>> = [];

    constructor() {
        this.closeDialogHandler = this.closeDialogHandler.bind(this);
        this.statusOnChangeHandler = this.statusOnChangeHandler.bind(this);
    }

    // Fixa event
    private closeDialogHandler(event) {
        this.closeDialog.emit(event);
    }

    componentWillRender() {
   //     this.generateOutput();
    }

 /*    private generateOutput() {
        const entries = Object.entries(this.mainContent);
        let item;
        for (let [key, value] of entries) {
            item = {
                text: key[0].toUpperCase() + key.slice(1),
                secondaryText: (typeof (value) === 'string' ? value[0].toUpperCase() + value.slice(1) : value)
            };
        }
        this.dialogOutput.push((item as ListItem));
    } */


    statusOnChangeHandler(event) {

        this.statusOnChange.emit(event);
    }

    public render() {
        console.log("Render i nya dialog!");

        return (
            <limel-dialog open={this.isVisable} onClose={this.closeDialogHandler}>

                <h1>{this.dialogMainData.title}</h1>
                <limel-list items={this.dialogMainData.dialogListItems}>
                </limel-list>
                <limel-select
                    // Vi vill ändra till den nya label som valts.
                    label={"Limetype status"}
                    value={this.selectedStatus}
                    options={this.dialogMainData.dialogDropDownOptions}
                    onChange={this.statusOnChangeHandler}
                />

                <limel-flex-container justify="end" slot="button">
                    <limel-button label="Close" onClick={this.closeDialogHandler} />
                </limel-flex-container>
            </limel-dialog>
        );
    }
}

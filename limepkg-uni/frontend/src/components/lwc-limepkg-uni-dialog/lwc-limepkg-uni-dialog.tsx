import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    NotificationService,
    PlatformServiceName,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop } from '@stencil/core';
import { Option, ListItem } from '@limetech/lime-elements';

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

    @Prop()
    statusOptions: Option[] = [];

    @Prop({ mutable: true })
    isVisable: boolean

    @Prop()
    selectedStatus: Option;

    private dialogOutput: Array<ListItem<any>> = [];

    constructor() {
        this.closeDialog = this.closeDialog.bind(this);
    }

    private closeDialog() {
        this.onClose();
    }

    componentWillRender() {
        this.generateOutput();
    }

    private generateOutput() {
        const entries = Object.entries(this.mainContent);
        let item;
        for (let [key, value] of entries) {
            item = {
                text: key[0].toUpperCase() + key.slice(1),
                secondaryText: (typeof (value) === 'string' ? value[0].toUpperCase() + value.slice(1) : value)
            };
        }
        this.dialogOutput.push((item as ListItem));
    }


    statusOnChange() {

    }

    public render() {
        console.log("Render i nya dialog!");

        return (
            <limel-dialog open={this.isVisable} onClose={this.closeDialog}>

                <h1>{this.header}</h1>
                <limel-list items={this.dialogOutput}>
                </limel-list>
                <limel-select
                    // Vi vill ändra till den nya label som valts.
                    label={"Limetype status"}
                    value={this.selectedStatus}
                    options={this.statusOptions}
                    onChange={this.statusOnChange}
                />

                <limel-flex-container justify="end" slot="button">
                    <limel-button label="Close" onClick={this.closeDialog} />
                </limel-flex-container>
            </limel-dialog>
        );
    }
}

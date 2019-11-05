import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { ListItem, ListSeparator } from '@limetech/lime-elements';



@Component({
    tag: 'lwc-limepkg-uni-uni-components',
    shadow: true,
    styleUrl: 'lwc-limepkg-uni-uni-components.scss',
})

export class UniComponents implements LimeWebComponent {
    @Prop()
    platform: LimeWebComponentPlatform;

    @Prop()
    context: LimeWebComponentContext;

    @Element()
    element: HTMLElement;

    @Prop()
    mainData: [{
        title: string,
        priority: string,
        misc: string,
        comment: string,
        status: string
    }];

    @Prop()
    dialogIsOpen: boolean;

    @Prop()
    dialogData: {};

    @Prop()
    onListItemClick: (event: CustomEvent<ListItem>) => void;

    @State()
    private listContainer = [];




 
    public componentWillRender() {
        console.log("componentWillRender")
        this.createOutPut();
    }
    private closeDialog() {
        console.log("Close dialog");
        this.dialogIsOpen = false;
        //this.dialog = null;
        // console.log(this.dialog);
    }


    /*     private createDialog(event: CustomEvent<ListItem>) {
            console.log("open dialog");
            let item = this.mainData.find(obj => obj.title === event.detail.text);
            this.dialog = <limel-dialog open={this.dialogIsOpen} onClose={this.closeDialog}>
                <h1>{item.title}</h1>
                <p>{"Priority: " + item.priority}</p>
                <p>{"Misc: " + item.misc}</p>
                <p>{"Comment: " + item.comment}</p>
                <p>{"Status: " + item.status}</p>
                <limel-flex-container justify="end" slot="button">
                    <limel-button primary={true} label="Close" onClick={this.closeDialog} />
                </limel-flex-container>
            </limel-dialog>
            console.log(this.dialogIsOpen);
    
            return event.detail;
        } */

    private createOutPut() {
        this.listContainer = [];
        let outPutList: Array<ListItem<any> | ListSeparator> = [];
        let currentStatus = this.mainData[0].status;
        let index = 0;
        this.mainData.forEach(object => {
            let item = {
                text: object.title,
                secondaryText: "Priority: " + object.priority + " Status: " + object.status,
                value: index++,
                open: "false"
            }
            if (currentStatus == object.status) {
                outPutList.push(
                    (item as ListItem),
                    { separator: true })
            } else {
                this.listContainer.push(outPutList);
                currentStatus = object.status;
                outPutList = [];
                outPutList.push(
                    (item as ListItem),
                    { separator: true })
            }
        })
        this.listContainer.push(outPutList);
    }


    public render() {
        console.log("Render i main-grid-compoennt");

        let output = this.listContainer.map(list => {
            return (
                <limel-flex-container direction={'vertical'} align={"stretch"} justify={"start"}>
                    <limel-list type="selectable" onChange={this.onListItemClick} items={list} />
                </limel-flex-container>
            )
        })

        console.log(output);
        return (
            <limel-flex-container direction={"horizontal"} align={"start"} justify={"space-between"}>
                {output}
            </limel-flex-container>
        );
    }
}
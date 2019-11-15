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
        secondaryText: string,
        priorityValue: number,
        id: number
    }];


    @Prop()
    onListItemClick: (event: CustomEvent<ListItem>) => void;

    @State()
    private listContainer = [];

    constructor() {
        this.createOutPut =this.createOutPut.bind(this);
    }
    public componentWillRender() {
        console.log("componentWillRender")
        this.createOutPut();
    }


    private createOutPut() {
        this.mainData.sort((a, b) => (a.priorityValue > b.priorityValue) ? 1 : ((b.priorityValue > a.priorityValue) ? -1 : 0));
        this.listContainer = [];
        let outPutList: Array<ListItem<any> | ListSeparator> = [];
        let currentStatus = this.mainData[0].priorityValue;
        this.mainData.forEach(object => {
            let secondaryText = null;
            if (object.secondaryText != null) {
                secondaryText = object.secondaryText;
            }
            let item = {
                text: object[Object.keys(object)[0]],
                secondaryText: secondaryText,
                value: object.id,
                open: "false"
            }
            if (currentStatus == object.priorityValue) {
                outPutList.push(
                    (item as ListItem),
                    { separator: true })
            } else {
                this.listContainer.push(outPutList);
                currentStatus = object.priorityValue;
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
        return (
            <limel-flex-container class="card" direction={"horizontal"} align={"start"} justify={"space-between"}>
                {output}
            </limel-flex-container>
        );
    }
}
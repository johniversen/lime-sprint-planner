import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { ListItem } from '@limetech/lime-elements';


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
        status: string,
        postId: number,
        priority: string
    }];

    @Prop()
    limeTypeMetaData: {}

    @Prop()
    onListItemClick: (event: CustomEvent<ListItem>) => void;

    @State()
    private listContainer = [];

    constructor() {
        this.createOutput = this.createOutput.bind(this);
    }
    public componentWillRender() {
        this.createOutput();
    }

    private createOutput() {
        this.mainData.sort((a, b) => (a.priorityValue > b.priorityValue) ? 1 : ((b.priorityValue > a.priorityValue) ? -1 : 0));
        let columnList = []
        this.listContainer = [];

        // If prio exists, create columns for each prio
        if (this.limeTypeMetaData['prio']) {
            Object.keys(this.limeTypeMetaData['prio']).forEach((key) => {
                let column = {
                    header: key[0].toUpperCase() + key.slice(1),
                    prio: this.limeTypeMetaData['prio'][key],
                    items: []
                }
                column.items.push(<h4 class="column-header">{column.header}</h4>)
                columnList.push(column);
            })
            columnList.sort((a, b) => (a.prio > b.prio) ? 1 : ((b.prio > a.prio) ? -1 : 0));
        } else { // If prio doesnt exist, show all objects in one column
            let column = {
                header: "Priority undefined",
                prio: 1,
                items: []
            }
            column.items.push(<h4 class="column-header">{column.header}</h4>)
            columnList.push(column);
        }

        this.listContainer = [];

        this.mainData.forEach(object => {
            let secondaryText = null;
            if (object.secondaryText != null) {
                secondaryText = object.secondaryText;
            }
            let item =
                <lwc-limepkg-uni-card 
                    header={object.title} 
                    subTitle={secondaryText} 
                    postId={object.postId} 
                    priority={object.priority}
                />

            let temp = columnList.find(col => col.prio === object.priorityValue);
            temp['items'].push(item);
        })
        columnList.forEach(column => {
            this.listContainer.push(column.items);
        })
    }

    public render() {
        let output = this.listContainer.map(list => {
            return (
                <limel-flex-container direction={'vertical'} align={"stretch"} justify={"start"}>
                    {list}
                </limel-flex-container>
            )
        })
        return (
            <limel-flex-container class="card" direction={"horizontal"} align={"center"} justify={"space-evenly"}>
                {output}
            </limel-flex-container>
        );
    }
}
import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
    //NotificationService,
} from '@limetech/lime-web-components-interfaces';
import { Component, Element, h, Prop, State, Listen, Event, EventEmitter } from '@stencil/core';

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
    mainData:  Array<{
        title: string,
        secondaryText: string,
        priorityValue: number,
        status: string,
        postId: number,
        priority: string
    }>;

    @Prop()
    limeTypeMetaData: {}

    @State()
    private listContainer = [];
    
    @Event({
        eventName: 'cardDropped',
        composed: true,
        cancelable: true,
        bubbles: true
    }) cardDropped: EventEmitter;

    private cardID;

    constructor() {
        this.createOutput = this.createOutput.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.cardDrag = this.cardDrag.bind(this);
    }
    public componentWillLoad() {
        this.createOutput();
    }
    public componentWillUpdate() {
        console.log("UNI UNI Component will update()")
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

            console.log(object);

            let temp = columnList.find(col => col.prio === object.priorityValue);
            temp['items'].push(item);
        })
        columnList.forEach(column => {
            this.listContainer.push(column.items);
        })
    }

    private allowDrop(event) {
        event.preventDefault();
    }

    @Listen('cardDragged')
    private cardDrag(event) {
        this.cardID = event.detail;
    }

    private cardDrop(event) {
        var prio;

        if (event.path[0].tagName == "H1") {
            prio = event.path[6].id;
        } else if (event.path[0].tagName == "DIV") {
            prio = event.path[5].id;
        } else if (event.path[0].tagName == "LWC-LIMEPKG-UNI-CARD" || event.path[0].tagName == "H4") {
            prio = event.path[3].id;
        } else if (event.path[0].tagName == "LIMEL-FLEX-CONTAINER") {
            prio = event.path[0].id;
        }

        let dragData = {
            cardID: this.cardID,
            columnID: prio
        }

        this.cardDropped.emit(dragData);
    }

    public render() {
        let output = this.listContainer.map(list => {
            return (
                <limel-flex-container id={(this.listContainer.indexOf(list) + 1).toString()} direction={'vertical'} align={"stretch"} justify={"start"} onDragOver={this.allowDrop} onDrop={this.cardDrop.bind(this)}>
                    {list}
                </limel-flex-container>
            )
        })
        console.log(output);
        return (
            <limel-flex-container class="card" direction={"horizontal"} align={"center"} justify={"space-evenly"}>
                {output}
            </limel-flex-container>
        );
    }
} 
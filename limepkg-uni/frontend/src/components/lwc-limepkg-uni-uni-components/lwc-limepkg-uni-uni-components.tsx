import {
    LimeWebComponent,
    LimeWebComponentContext,
    LimeWebComponentPlatform,
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
    mainData: Array<{
        priorityValue: number
        Card: {
            CardTitle: string,
            Responsible: string
        },
        AdditionalInfo: {
        }
        postId: number
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
        this.createOutput();
    }

    private createOutput() {
        this.mainData.sort((a, b) => (a.priorityValue > b.priorityValue) ? 1 : ((b.priorityValue > a.priorityValue) ? -1 : 0));
        let columnList = []
        this.listContainer = [];

        // If prio exists, create columns for each prio
        if (this.limeTypeMetaData['PriorityHierarchy']) {
            Object.keys(this.limeTypeMetaData['PriorityHierarchy']).forEach((key) => {
                let column = {
                    header: key[0].toUpperCase() + key.slice(1),
                    prio: this.limeTypeMetaData['PriorityHierarchy'][key],
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

        // Loops through mainData and creates a card for every entry
        this.mainData.forEach(obj => {
            let object = Object.assign({}, obj)
            let card = {...object.Card}
            let cardTitle = (' ' + card.CardTitle).slice(1);

            delete card.CardTitle
            let optionalInfo = {}
            if (object.AdditionalInfo['Priority']) {
                optionalInfo['Priority'] = object.AdditionalInfo['Priority']
            }
            let item =
                <lwc-limepkg-uni-card
                    CardTitle={cardTitle}
                    postId={object.postId}   
                    cardData={card}
                    optionalInfo={optionalInfo}
                />

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
        var prio = this.getColumnID(event);

        let dragData = {
            cardID: this.cardID,
            columnID: prio
        }

        this.cardDropped.emit(dragData);
    }

    private getColumnID(event) {
        var prio;

        if (event.path[0].tagName == "DIV" && event.path[0].className == "container") {
            prio = event.path[8].id;
        } else if (event.path[0].tagName == "P") {
            prio = event.path[7].id;
        } else if (event.path[0].tagName == "H3" || event.path[0].tagName == "H1") {
            prio = event.path[6].id;
        } else if (event.path[0].tagName == "DIV") {
            prio = event.path[5].id;
        } else if (event.path[0].tagName == "LWC-LIMEPKG-UNI-CARD" || event.path[0].tagName == "H4") {
            prio = event.path[3].id;
        } else if (event.path[0].tagName == "LIMEL-FLEX-CONTAINER") {
            prio = event.path[0].id;
        }

        return prio;
    }

    public render() {
        let output = this.listContainer.map(list => {
            // Return for the vertical card container
            return (
                <limel-flex-container id={(this.listContainer.indexOf(list) + 1).toString()} class="cardContainer" direction={'vertical'} align={"stretch"} justify={"start"} onDragOver={this.allowDrop.bind(this)} onDrop={this.cardDrop.bind(this)}>
                    {list}
                </limel-flex-container>
            )
        })
        // Return for horizontal list of statuses, the "headers"
        return (
            <limel-flex-container class="outputContainer" direction={"horizontal"} align={"center"} justify={"space-evenly"}>
                {output}
            </limel-flex-container>
        );
    }
} 